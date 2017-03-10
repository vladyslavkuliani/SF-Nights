import React, {Component} from 'react';
import ReactStars from 'react-stars';
import axios from 'axios';


class Comments extends Component{

  constructor(props){
      super(props);
      this.comment = '';
      this.rating = 0;
      this.state = {
        updateComments: false
      }
  }


  ratingChanged(e){
    console.log("changed rating", e);
    this.rating = e;
    console.log(this.rating);
  }
  commentChanged(e){
    this.comment = e.target.value;
  }

  submit(e){
    var thisComponent = this;
    var data = {comment: this.comment, rating: this.rating, yelp_id: this.props.id};
    e.preventDefault();
    axios.post('/leavecomment', data).then(function(response){
      thisComponent.props.onNewCommentAdd(response.data);
    });  
  }


  render(){
    return (
      <form onSubmit={this.submit.bind(this)}>
        <ReactStars count={5} onChange={this.ratingChanged.bind(this)} size={24} color2={'#ffd700'} name="rating"/>
        <input type="textfield"  onChange={this.commentChanged.bind(this)} name="comment"></input>
        <input type="submit" value="Submit" className="btn m-b-xs w-xs btn-dark"/>
        <hr/>
      </form >
    );
  }


}
export default Comments;