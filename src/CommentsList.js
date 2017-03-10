import React, {Component} from 'react';
import ReactStars from 'react-stars'
import axios from 'axios';
import styles from '../public/style/placePage.css';

class CommentsList extends Component{
    constructor(props){
        super(props);
    }

    render(){
        function compare(a,b) {
            if (a._id < b._id)
                return -1;
            if (a._id > b._id)
                return 1;
            return 0;
        }

        console.log(this.props.comments);
        let commentsList = this.props.comments.sort(compare).reverse().map((comment)=>{
            return (
                <div key={comment._id} className="commentBlock">
                    <div key={comment._id} className="commentBlock">
                        <img src="http://i.imgur.com/7Yc9GZf.png" className="commentImg"></img>
                        <strong className="userName">{comment.userName}</strong>
                        <div className="commentsRating"><ReactStars count={5} value={comment.rating} edit={false} size={18} color2={'#ffd700'} name="rating"/></div>
                        <p className="commentContent">{comment.content}</p>             
                    </div>
                    <hr/>
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