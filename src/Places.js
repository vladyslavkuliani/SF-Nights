import React, {Component} from 'react';
import PlacesList from './PlacesList';
import axios from 'axios';

class Places extends Component{
  constructor(props){
    super(props);
    this.state = {readyToRender: false};

    this.map;
    this.markers;
    this.nightClubs = [];
    this.allPosts=[];
    this.currentPost;
    this.isCurrentPlaceOpen;
    this.content;
  }

  populateMap(){
    axios.defaults.baseURL = location.protocol + '//' + location.hostname + ':' + 3001;

    var thisClass = this;
    this.nightClubs = [];
    this.allPosts = [];
    this.markers = [];
    
    var allClubs = [];
    var currentPlace;
    var errorPlaces = 0;
    var i = 0;

    axios.get('/getyelpdata').then(function(places){
      thisClass.nightClubs = places.data.jsonBody.businesses;
      thisClass.nightClubs.forEach(function(place, index){
        axios.post('/findorcreate', {id: place.id}).then(function(club){
          console.log(club);
            if(club!={}){
              thisClass.isCurrentPlaceOpen = club.data.place.is_open_now;
              thisClass.currentPost = club.data.post;
              allClubs.push(club.place);
              thisClass.allPosts.push(thisClass.currentPost);


              thisClass.content = '<div class="row info-marker"><div class="col-md-9"><h4> '+place.name+'</h4>' +
              "Tonight's rating: <strong>" + thisClass.currentPost.rating + "</strong> | <strong>" + thisClass.currentPost.votes.length +"</strong> votes<br>" +
              place.location.display_address[0] + ", " + place.location.display_address[1] +
              '</div>' +
              '<div class="col-md-3">' + '<div>' +(place.distance/1000).toFixed(2)+ 'km</div>' +
              '<div>' + place.price +'</div>';
              if(thisClass.isCurrentPlaceOpen){
                thisClass.content += '<span class="isOpen green-text"><strong>Open<strong></span>'+'</div>' + '</div>';
              }
              else{
                thisClass.content += '<span class="isOpen red-text"><strong>Closed</strong></span>'+'</div>' + '</div>';
              }

              var marker = new window.google.maps.Marker({
                      placeName: place.name,
                      position: new window.google.maps.LatLng(place.coordinates.latitude, place.coordinates.longitude),
                      map: thisClass.map
                });


              var infoWindow = new window.google.maps.InfoWindow({content: thisClass.content});

              console.log("INDEX " + index);
              marker.addListener('click', function(){
                infoWindow.open(thisClass.map, marker);
                window.scrollTo(0, index*116);
                document.getElementsByClassName('.place-info').css('border', '1px solid #DCDCDC');
                document.getElementById(place.id).css('border', '3px solid #00AF33');
              });

              thisClass.markers.push(marker);
              if((thisClass.nightClubs.length)===thisClass.allPosts.length){
                thisClass.setState({readyToRender: true});
              }
          }
          else{
            place.id;
          }
        });
      });
    });
  }

  componentDidMount(){
    var thisClass = this;
    axios.defaults.baseURL = location.protocol + '//' + location.hostname + ':' + 3001;
    axios.get('/position').then(function(position){
      console.log(position);
      thisClass.map = new window.google.maps.Map(document.getElementById('map'), {
        center: {lat: parseFloat(position.data.lat), lng:parseFloat(position.data.lng)},
        zoom: 12
      });

    // var marker = new window.google.maps.Marker({
    //     position: new window.google.maps.LatLng(position.data.lat, position.data.lng),
    //     map: map
    // });

      var infoWindow = new window.google.maps.InfoWindow({map: thisClass.map});

      infoWindow.setPosition({lat: parseFloat(position.data.lat), lng: parseFloat(position.data.lng)});
      infoWindow.setContent('You are here');
    });

    this.populateMap();
  }

  render(){
    return (
      <div>
        <div id="map"></div>
        <div className="col-md-6 col-md-offset-6">
          {this.state.readyToRender && <PlacesList places={this.nightClubs} markers={this.markers} allPosts={this.allPosts}/>}
        </div>
      </div>
    );
  }
}

export default Places;
