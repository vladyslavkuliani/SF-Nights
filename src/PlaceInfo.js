import React, {Component} from 'react';
import ReactStars from 'react-stars'
import axios from 'axios';

import NavBar from './NavBar';
import styles from '../public/style/navbar.css';
import Comments from './comments';


class PlaceInfo extends Component{
    constructor(props){
        super(props);
        this.state = {
            post: null,
            gotPost: false
        }
    }

  componentDidMount(){
    var thisComponent = this;
    // this.getPostData(this.props.place.id, false);
    axios.defaults.baseURL = location.protocol + '//' + location.hostname + ':' + 3001;
    axios.get("/getpost", {params:{clubId: this.props.place.id}}).then(function(post){
      console.log("COMPONENT DID:");
      console.log(post);
    //   if(commentsNeeded){
    //     axios.get("/comments", {post: post}).then(function(comments){
    //       console.log(comments);
    //       thisComponent.setState({comments: comments, gotComments: true});
    //     });
    //   }
        thisComponent.setState({post: post.data, gotPost: true});
    });
  }

  getPostData(placeId, commentsNeeded){
        var thisComponent = this;
  }


  render(){
    var place = this.props.place;
    var post = this.props.post;
    return (
      <div className="place-info col-md-8 col-md-offset-2">
        <NavBar gotLocationData={this.state.gotLocationData}/>
        <img src={place.image_url} className="place-info-img" />
        <h3>{place.name}</h3>
        {this.props.isOpenNow && this.state.gotPost && <span className="rating-tonight">Rating tonight: <strong>{this.state.post.rating}</strong> | <strong>{this.state.post.votes.length}</strong> votes</span>}
        {this.props.isOpenNow && <Comments id={this.props.place.id}/>}
      </div>
    );
  }
}

export default PlaceInfo;
// <span>Rating tonight:   | <strong>{post.votes.length}</strong> votes</span>
