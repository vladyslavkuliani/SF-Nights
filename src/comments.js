import React, {Component} from 'react';
import ReactStars from 'react-stars'
import axios from 'axios';


class Comments extends Component{

  ratingChanged(){
    console.log("changing stars");
  }


  render(){
    return (
      <form>
      <ReactStars count={5} onChange={this.ratingChanged.bind(this)} size={24} color2={'#ffd700'} />
      <input type="textfield"></input>
      <button className="btn m-b-xs w-xs btn-dark" onClick={()=>{this.props.leaveComment()}}>Comment</button>
      </form>
    );

  }


}
export default Comments;
