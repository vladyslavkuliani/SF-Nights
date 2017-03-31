import React, {Component} from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import CommentsList from './CommentsList';

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
    // axios.defaults.baseURL = location.protocol + '//' + location.hostname + ':' + (process.env.API_PORT || 3001);
    axios.defaults.baseURL = 'https://hidden-sierra-78177.herokuapp.com';
    axios.get("/currentuser").then((user)=>{
      thisClass.setState({user: user.data, gotUser:true});
    });
  }

  componentDidMount(){
    const Fn = this;
    // axios.defaults.baseURL = location.protocol + '//' + location.hostname + ':' + (process.env.API_PORT || 3001);
    axios.defaults.baseURL = 'https://hidden-sierra-78177.herokuapp.com';
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
      <div className="row">
        <br />
        <NavBar gotLocationData={this.state.gotLocationData}/>

        <div className="col-md-4 user-profile">
            {this.state.gotUser && <img src="http://i.imgur.com/7Yc9GZf.png" className="user-img"/>}
            <h3>{this.state.gotUser && this.state.user.name}</h3>
            <hr/>
        </div>
      </div>
    );
  }
}

export default UserProfile;
