import React, {Component} from 'react';
import axios from 'axios';
import NavBar from './NavBar';

class UserProfile extends Component{
  constructor(props){
    super(props);
    this.state = {
      gotLocationData: false, 
      user:null,
      gotUser:false
    };
  }

  componentWillMount(){
    var thisClass = this;
    axios.defaults.baseURL = location.protocol + '//' + location.hostname + ':' + 3001;
    axios.get("/currentuser").then((user)=>{
      console.log(user);
      thisClass.setState({user: user.data, gotUser:true});
    });
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

        {this.state.gotUser && <h1>Welcome! {this.state.user.name}</h1>}
        {this.state.gotLocationData && <a href="/places">See Places</a>}
      </div>
    );
  }
}

export default UserProfile;
