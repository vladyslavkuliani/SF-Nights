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

    var numPlacesWithNoData = 0;

    axios.get('/getyelpdata').then(function(places){
      thisClass.nightClubs = places.data.jsonBody.businesses;
      console.log(thisClass.nightClubs);
      thisClass.nightClubs.forEach(function(place, index){
        axios.post('/findorcreate', {id: place.id}).then(function(club){
          console.log(club);
            if(club.data!=""){
              thisClass.isCurrentPlaceOpen = club.data.place.is_open_now;
              thisClass.currentPost = club.data.post;
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

              marker.addListener('click', function(){
                infoWindow.open(thisClass.map, marker);
                window.scrollTo(0, index*116);
                var notSelectedElements =   document.getElementsByClassName('place-info');
                for(var i=0; i<notSelectedElements.length; i++){
                  notSelectedElements[i].setAttribute("style", "border: 2px solid #DCDCDC");
                }

                document.getElementById(place.id).setAttribute("style", "border: 5px solid #00AF33");//#00AF33
              });

              thisClass.markers.push(marker);

              if((thisClass.nightClubs.length-numPlacesWithNoData)===thisClass.allPosts.length){
                thisClass.setState({readyToRender: true});
              }
          }
          else{
            numPlacesWithNoData++;
          }
        });
      });
    });
  }

  componentDidMount(){
    var thisClass = this;
    axios.defaults.baseURL = location.protocol + '//' + location.hostname + ':' + 3001;
    axios.get('/position').then(function(position){
      console.log("position",position);
      thisClass.map = new window.google.maps.Map(document.getElementById('map'), {
        center: {lat: parseFloat(position.data.lat), lng:parseFloat(position.data.lng)},
        zoom: 12
      });

      var infoWindow = new window.google.maps.InfoWindow({map: thisClass.map});

      infoWindow.setPosition({lat: parseFloat(position.data.lat), lng: parseFloat(position.data.lng)});
      infoWindow.setContent('You are here');
    });

    this.populateMap();
  }

  render(){
    {console.log(this.nightClubs)}
    {console.log(this.markers)}
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
