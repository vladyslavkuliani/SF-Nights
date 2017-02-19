import React, {Component} from 'react';
import ReactStars from 'react-stars'
import axios from 'axios';

class CommentsList extends Component{
    constructor(props){
        super(props);

        this.commentImg = {
            borderRadius: "100%",
            float: "left",
            height: "100px",
            width: "100px"
        }
    }

    render(){
        console.log(this.props.comments);
        let commentsList = this.props.comments.reverse().map((comment)=>{
            return (
                <div key={comment._id}>
                    <div key={comment._id}>
                        <img src={comment.userProfilePic} style={this.commentImg}></img>
                        <h4>{comment.userName}</h4>
                        <h4>{comment.rating}</h4>
                        <p>{comment.content}</p>             
                    </div>
                    <br/>
                </div>
            );
        });

        return (
            <div>
                {commentsList}
            </div>
        )
    }
}

export default CommentsList;