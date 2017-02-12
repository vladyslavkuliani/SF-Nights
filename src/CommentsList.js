import React, {Component} from 'react';
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
        let comments = this.props.comments.map((id)=>{
            axios.get('/comment', {params: {id: id}}).then((comment)=>{
                return comment;
            });  
        });
        //TODO: add comments list with user data, rating, time posted, content

        return (
            <div>
                <img src={this.props.user.profilePicture} style={this.commentImg}></img>
            </div>
        )
    }
}

export default CommentsList;