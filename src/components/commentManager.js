import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { db } from '../lib/firebase';

import CommentListItem from './commentListItem';

const CommentManager = (props) => {

    const [newComment, setNewComment] = useState(null);
    const [lastComment, setLastComment] = useState(null);
    const [comments, setComments] = useState([]);
    const [user, setUser] = useState(null);

    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(2);
    const [pagingDirection, setPagingDirection] = useState(null);



    const getComments = async(commentStatus) => {
        if (props.placeId === null) {
            return;
        }

        
		let commentsRef = db.collection('places')
                            .doc(props.placeId)
                            .collection('comments')
                            .orderBy('createdAt','desc')
                            .limit(3);

        if (lastComment !== null) {
            commentsRef = commentsRef.startAfter(lastComment);
        }
        
		const snapshot = await commentsRef.get();
		if (snapshot.empty) {
			console.log('No matching comments.');
            setComments(comments);
			return;
		}

        setLastComment(snapshot.docs[snapshot.docs.length - 1]);

        let commentsToAddToCommentList = [];
		snapshot.forEach(doc => {
            let comment = {}
			comment.data = doc.data();
			comment.id = doc.id;
			commentsToAddToCommentList.push(comment);
		});

        
        let updatedCommentsList = comments.concat(commentsToAddToCommentList);
        console.log(comments,commentsToAddToCommentList, updatedCommentsList);

        setComments(updatedCommentsList);
        
	}



    const handleCommentChange = (e) => {
		setNewComment(e.target.value);
	}

    
    const saveComment = async(e) => {
        e.preventDefault();

        let commentDataToSave = {};
        commentDataToSave.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        commentDataToSave.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
        commentDataToSave.status = 0;
        commentDataToSave.uid = user.uid;
        commentDataToSave.comment = newComment;

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

            <button className="button" onClick={getComments}>More</button>
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