import React, {Component} from 'react';
import ReactStars from 'react-stars'
import axios from 'axios';


class Comments extends Component{

  constructor(props){
      super(props);
      this.comment = '';
      this.rating = 0;
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
    // axios.defaults.baseURL = location.protocol + '//' + location.hostname + ':' + 3001;
    var thisComponent = this;
    var data = {comment: this.comment, rating: this.rating, yelp_id: this.props.id};
    e.preventDefault();
    console.log("handleonpost", e);
    console.log("rating: ", this.rating)
    console.log("comment: ", this.comment)
    console.log("data: ", data)
    axios.post('/leavecomment', data).then(function(response){
      console.log(response);
      thisComponent.setState({newComment: false, updateComments: false});
      thisComponent.setState({updateComments: true});
    });
  }


  render(){
    return (
      <form onSubmit={this.submit.bind(this)}>
      <ReactStars count={5} onChange={this.ratingChanged.bind(this)} size={24} color2={'#ffd700'} name="rating"/>
      <input type="textfield"  onChange={this.commentChanged.bind(this)} name="comment"></input>
      <input type="submit" value="Submit" className="btn m-b-xs w-xs btn-dark"/>
      </form >
    );

  }


}
export default Comments;
