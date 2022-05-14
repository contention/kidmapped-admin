import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { db } from '../lib/firebase';

import CommentListItem from './commentListItem';

const CommentManager = (props) => {

    const [comment, setComment] = useState();
    const [comments, setComments] = useState([]);
    const [user, setUser] = useState(null);

    const [page, setPage] = useState(0);



    const getComments = async(commentStatus) => {
        if (props.placeId === null) {
            return;
        }

        


		let commentList = [];
		const commentsRef = db.collection('places').doc(props.placeId).collection('comments').orderBy('createdAt','desc').limit(2);
		const snapshot = await commentsRef.get();
		if (snapshot.empty) {
			console.log('No matching comments.');
            setComments(commentList);
			return;
		}
		snapshot.forEach(doc => {
			//console.log(doc.data());
            let comment = {}
			comment.data = doc.data();
			comment.id = doc.id;
			commentList.push(comment);
			console.log(commentList);
		});
        setComments(commentList);
        
	}


    const handleCommentChange = (e) => {
		setComment(e.target.value);
	}

    
    const saveComment = async(e) => {
        e.preventDefault();

        let commentDataToSave = {};
        commentDataToSave.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        commentDataToSave.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
        commentDataToSave.status = 0;
        commentDataToSave.uid = user.uid;
        commentDataToSave.comment = comment;

        console.log('commentDataToSave:', commentDataToSave);

        await db.collection('places').doc(props.placeId).collection('comments').add(commentDataToSave)
        .then(() => {
			getComments();
            console.log('Saved');
        })
        .catch(error => {
            console.log(error);
        });
    }
    


    //On mount
	useEffect(() => {
		getComments();

        const authListener = firebase.auth().onAuthStateChanged(function(user) {
			if (user !== null) {
			  setUser(user);
			}
		});

	}, []);


    let commentsUi =    <div className="notification is-warning">
                            You need to save this place before you can manage comments.
                        </div>;

    if (props.placeId !== null) {
        commentsUi = <div>

            <form onSubmit={saveComment}>
            <div className="field">
                <label className="label">Add a comment</label>
                <div className="control">
                    <textarea
                        className="textarea"
                        name="comment"
                        onChange={handleCommentChange}
                    />
                </div>
                <div className="control">
                    <input className="button is-success" type="submit" value="Save" />
                </div>
            </div>


            </form>


            <ul className="commentsList">
            {comments.map(function(comment, i){
                return (
                    <CommentListItem key={i} placeId={props.placeId} comment={comment}/>
                )
            })}
            </ul>
        </div>
    }



    return (
        <div className="box">
            <h3>Comments</h3>
            {commentsUi}
        </div>
    );

}

export default CommentManager;