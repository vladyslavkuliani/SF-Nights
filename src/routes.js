import React from 'react';
import {Router, Route} from 'react-router';

import LogInForm from './LogInForm';
import SignUpForm from './SignUpForm';
import UserProfile from './UserProfile';
import Places from './Places';
import PlacePage from './PlacePage';

const Routes = (props) => (
  <Router {...props}>
    <Route path="/login" component={LogInForm}/>
    <Route path="/signup" component={SignUpForm}/>
    <Route path="/profile" component={UserProfile}/>
    <Route path="/places" component={Places}/>
    <Route path="/places/:id" component={PlacePage}/>
  </Router>
);

export default Routes;
// $.get('/position', function(position){
//   map = new google.maps.Map(document.getElementById('map'), {
//     center: {lat: parseFloat(position.lat), lng:parseFloat(position.lng)},
//     zoom: 12
//   });
//   // parseFloat(position.lat) parseFloat(position.lng)
//   var infoWindow = new google.maps.InfoWindow({map: map});
//
//   infoWindow.setPosition({lat: parseFloat(position.lat), lng: parseFloat(position.lng)});
//   infoWindow.setContent('You are here');
// });
