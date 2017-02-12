var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('./model/user.js');
const yelp = require('yelp-fusion');
var db = require('./model');

var app = express();
var router = express.Router();

var currentUserLocation = {
  "lat": null,
  "lng": null
}
var client;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
 res.setHeader("Access-Control-Allow-Origin", "*");
 res.setHeader("Access-Control-Allow-Credentials", 'true');
 res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
 res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
 res.setHeader("Cache-Control", "no-cache");
  next();
});

app.post('/signup', function(req, res){
  db.User.create(req.body, function(err, newUser){
    if(!err){ res.json(newUser);
    return console.log('Success -> ', newUser , '<- was created');
  }
    console.log('There was an error creating a new user -> ', err);
  });
});

app.get('/position', function(req, res){
  res.json({lat:currentUserLocation["lat"], lng:currentUserLocation["lng"]});
});

app.post('/setcurrentlocation', function(req, res){
  currentUserLocation["lat"] = req.body.lat;
  currentUserLocation["lng"] = req.body.lng;
});

app.get("/getyelpdata", function(req,res){
  yelp.accessToken("zlyKmaUcKVM3dc3lQQjfjQ", "xq4eOIaI6Lqupx1X0WYi5JD0ZuHm4VQLlpxxBMGT93btB7AQ86csvScdMD2yLC2d").then(response => {
    client = yelp.client(response.jsonBody.access_token);

    client.search({
      term:'Bars',
      latitude: currentUserLocation["lat"],
      longitude: currentUserLocation["lng"],
      radius: 7000,
      limit:10
    }).then(response => {
      res.json(response);
    });
  }).catch(e => {
    console.log(e);
  });
});

app.post('/findorcreate', function(req,res){

  function returningNewPlace(place, newPost){
    res.json({place: place, post: newPost});
  }

  function returnExistingPlace(place){
    db.Post.findOne({_id: place.currentPost}, function(err, post){
      res.json({place: place, post: post});
    });
  }

  db.Place.findOne({yelp_id: req.body.id}, function(err, foundPlace){
      client.business(req.body.id).then(function(detailedInfoPlace){
        console.log("DETAILED INFO");
        console.log(detailedInfoPlace.jsonBody["hours"]);
          if(!foundPlace){
            var newPlace = new db.Place({
              yelp_id: req.body.id,
              currentPost: null,
              visitors: [],
              posts:[]
            });

            if(typeof detailedInfoPlace.jsonBody["hours"] !== "undefined"){
              newPlace.is_open_now = detailedInfoPlace.jsonBody["hours"][0].is_open_now;
            }
            else{
              newPlace.is_open_now = false;
            }

            newPlace.save();

            var newPost = new db.Post({
                date: new Date(),
                rating: 0,
                placeId: newPlace._id,
                comments: []
            });
            newPost.save();

            newPlace.currentPost = newPost._id;
            newPlace.save();
            returningNewPlace(newPlace, newPost);
        }
        else{
          foundPlace.is_open_now = detailedInfoPlace.jsonBody["hours"][0].is_open_now;
          foundPlace.save();
          returnExistingPlace(foundPlace);
        }

      }).catch(e => {
        console.log(e);
        res.json();
      });
  });
});

app.get('/getplace', function(req,res){
    client.business(req.query.id).then(function(place){
      res.json(place);
    });
});

app.get('/getpost', function(req, res){
  console.log("------------------------");
  console.log(req.query);
  db.Place.findOne({yelp_id: req.query.clubId}, function(err, place){
    console.log(place);
    db.Post.findOne({_id: place.currentPost}, function(err, post){
      res.json(post);
    })
  });
});

var server = app.listen(process.env.API_PORT || 3001);
