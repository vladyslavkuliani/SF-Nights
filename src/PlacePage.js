import React, {Component} from 'react';
import axios from 'axios';
import PlaceInfo from './PlaceInfo';
import PostInfo from './PostInfo';
import SorryMessage from './SorryMessage';

class PlacePage extends Component{
    constructor(props){
        super(props);
        this.state = {
            gotPlace: false,
            place: null,
            is_open_now: false
        }
    }

  componentDidMount(){
    axios.defaults.baseURL = 'https://hidden-sierra-78177.herokuapp.com';
    var arrUrl = window.location.href.split("/");
    var id =  arrUrl[arrUrl.length - 1];
    var thisComponent = this;
    axios.get("/getplace", {params:{id: id}}).then(function(place){
      place.data.jsonBody.hours[0].is_open_now ? thisComponent.setState({place: place.data, gotPlace: true, is_open_now: true}) : thisComponent.setState({place: place.data, gotPlace: true});
    });
  }

  render(){
    return (
      <div>
        {this.state.gotPlace && <PlaceInfo isOpenNow={this.state.is_open_now} place={this.state.place.jsonBody} />}
        {this.state.gotPlace && ((this.state.is_open_now && <PostInfo isOpenNow={this.state.is_open_now} place={this.state.place.jsonBody}/>) || <SorryMessage/>)}
        
      </div>
    );
  }
}

export default PlacePage;
