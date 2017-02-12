import React, {Component} from 'react';
import axios from 'axios';

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
      console.log("POST------:");
    console.log(this.state.post);
    var place = this.props.place;
    var post = this.props.post;
    return (
      <div className="place-info col-md-8 col-md-offset-2">
        <img src={place.image_url} className="place-info-img" />
        <h3>{place.name}</h3>
        {this.props.isOpenNow && this.state.gotPost && <span className="rating-tonight">Rating tonight: <strong>{this.state.post.rating}</strong> | <strong>{this.state.post.votes.length}</strong> votes</span>}
        {this.props.isOpenNow && <div className="comment-btn"><button className="btn m-b-xs w-xs btn-dark" onClick={()=>{this.props.leaveComment()}}>Comment</button></div>}
      </div>
    );
  }
}

export default PlaceInfo;
// <span>Rating tonight:   | <strong>{post.votes.length}</strong> votes</span>