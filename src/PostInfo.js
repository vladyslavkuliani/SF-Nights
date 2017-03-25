import React, {Component} from 'react';
import axios from 'axios';
import Comments from './Comments';
import CommentsList from './CommentsList';

 class PostInfo extends Component{
  constructor(props){
      super(props);
      this.state={
        comments: [],
        gotComments: false,
      }
  }

  componentDidMount(){
    axios.defaults.baseURL = location.protocol + '//' + location.hostname + ':' + (process.env.API_PORT || 3001);
    var thisComponent = this;
    var tonightsComments = [];
    axios.get("/getpost", {params:{clubId: this.props.place.id}}).then(function(post){
      post.data.comments.forEach(function(commentId){
        axios.get('/comment', {params: {id: commentId}}).then((com)=>{
          tonightsComments.push(com.data);
          if(tonightsComments.length === post.data.comments.length){
            thisComponent.setState({comments: tonightsComments});
          }
        });
      });
    });
  }

  addNewComment(newComment){
    var newC = this.state.comments;
    newC.push(newComment);
    this.setState({comments: newC});
  }

  render(){
    return (
      <div className="col-md-8 col-md-offset-2 post-info">
        {this.props.isOpenNow && <Comments id={this.props.place.id} onNewCommentAdd={this.addNewComment.bind(this)}/>}
        {((this.state.comments.length>0) && <CommentsList comments={this.state.comments}/>) || <div><h1>Be the first one to comment!</h1></div> }
      </div>
    );
  }
}

export default PostInfo;