import React, {Component} from 'react';
import axios from 'axios';
import NavBar from './NavBar';

class UserProfile extends Component{
  constructor(props){
    super(props);
    this.state = {gotLocationData: false};
  }

  componentDidMount(){
    const Fn = this;
    axios.defaults.baseURL = location.protocol + '//' + location.hostname + ':' + 3001;
    axios.get('/position').then((pos)=>{
      if(!pos.lat){
        console.log("HERE!!!!");
        navigator.geolocation.getCurrentPosition(function(position){
          console.log(position);
          axios.post('/setcurrentlocation', {lat:position.coords.latitude, lng:position.coords.longitude})
          .then(Fn.setState({gotLocationData: true}));
        });
      }
      else{
        Fn.setState({gotLocationData: true});
      }
    });
  }

  render(){
    return (
      <div>
        <NavBar gotLocationData={this.state.gotLocationData}/>
        <h1>USER PROFILE SHOULD BE HERE!</h1>
      </div>
    );
  }
}

export default UserProfile;
