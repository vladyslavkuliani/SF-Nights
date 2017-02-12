var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
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
var userId;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: 'VladsIngredientSuperSecretCookie',
  cookie: { maxAge: 30 * 60 * 1000 } // 30 minute cookie lifespan (in milliseconds)
}));
app.use(function(req, res, next) {
 res.setHeader("Access-Control-Allow-Origin", "*");
 res.setHeader("Access-Control-Allow-Credentials", 'true');
 res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
 res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
 res.setHeader("Cache-Control", "no-cache");
  next();
});

app.post('/signup', function(req, res){
  User.createSecure(req.body.name, req.body.email, req.body.dob, req.body.password, function(err, user){
    if(err){console.log(err);}
    res.json(user);
  });
});

app.post('/login', function(req, res){
  User.authenticate(req.body.email, req.body.password, function(err, user){
    req.session.userId = user._id
    userId = user._id;
    res.json(user);
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
      term:'Night clubs',
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
          if(typeof detailedInfoPlace.jsonBody["hours"] !== "undefined"){
              foundPlace.is_open_now = detailedInfoPlace.jsonBody["hours"][0].is_open_now;
            }
            else{
              foundPlace.is_open_now = false;
            }
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
  db.Place.findOne({yelp_id: req.query.clubId}, function(err, place){
    db.Post.findOne({_id: place.currentPost}, function(err, post){
      res.json(post);
    });
  });
});

app.post('/leavecomment', function(req, res){
  var newComment = new db.Comment({
    content: req.body.comment,
    userId: req.session.userId,
    rating: req.body.rating
  });
  newComment.save();

  db.Place.findOne({yelp_id: req.body.id}, function(err, foundPlace){
    db.Post.findOne({_id: foundPlace.currentPost}, function(err, foundPost){
      foundPost.comments.push(newComment._id);
      foundPost.votes.push(req.body.rating);
      foundPost.rating = (foundPost.votes.reduce((a,b)=>{return a+b}, 0)/foundPost.votes.length).toFixed(1);
      foundPost.save();
      newComment.postId = foundPost._id;
      newComment.save();
    });

    var newUserPlace = new db.UserPlace({
      date: new Date(),
      placeId: foundPlace._id,
      visitorId: req.session.userId
    });
    newUserPlace.save();
    foundPlace.visitors.push(newUserPlace._id);
    foundPlace.save();

    db.User.findOne({_id: req.session.userId}, function(err, user){
      user.visitedPlaces.push(newUserPlace._id);
      user.comments.push(newComment._id);
      user.save();
      newComment.userName = user.name;
      newComment.userProfilePic = user.profilePicture;
      newComment.save();
    });
  });

  res.json(newComment);
});

app.get("/comment", function(req, res){
    db.Comment.findOne({_id: req.query.id}, function(err, comment){

      res.json(comment);
    });
});

app.get('/currentuser', function(req, res){
  console.log("-------------");
  console.log(userId);
  db.User.findOne({_id: userId}, function(err, user){
    res.json(user);
  });
})

var server = app.listen(process.env.API_PORT || 3001);
