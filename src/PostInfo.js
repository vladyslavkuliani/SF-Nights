import React, {Component} from 'react';
import axios from 'axios';

 class PostInfo extends Component{
  constructor(props){
      super(props);
      this.state={
        comments: [],
        gotComments: false
      }
  }

  componentDidMount(){
      console.log(this.props.place);
    axios.defaults.baseURL = location.protocol + '//' + location.hostname + ':' + 3001;
    var thisComponent = this;
    var tonightsComments = [];
    axios.get("/getpost", {params:{clubId: this.props.place.id}}).then(function(post){
      post.data.comments.forEach(function(commentId){
        axios.get('/comment', {id: commentId}).then((com)=>{
          console.log("COMMENT!!!");
          console.log(com);
          tonightsComments.push(com);
          if(tonightsComments.length === post.comments.length){
            thisComponent.setState({comments: tonightsComments, gotComments: true});
          }
        });
      });
    });
  }

  render(){
    var tempArr = this.state.comments.sort((a,b)=>{a._id < b._id});
        var allComments = tempArr.map((comment)=>{
        return (
        <div>
          <a className="pull-left thumb-sm">
            <img src={comment.userProfilePic} className="img-circle"/>
          </a>
          <div className="m-l-xxl m-b">
            <div>
              <a href><strong>{comment.userName} | {comment.rating}</strong></a>
              <span className="text-muted text-xs block m-t-xs">
                X minutes ago
              </span>
            </div>
            <div className="m-t-sm">{comment.content}</div>
          </div>
          <hr/>
        </div>
      );
    });

    return (
      <div className="col-md-8 col-md-offset-2 post-info">
        {((this.state.comments.length>0) && allComments) || <div><h1>Be the first one to comment!</h1></div> }
      </div>
    );
  }
}

export default PostInfo;
