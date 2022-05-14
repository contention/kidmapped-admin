import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { db } from '../lib/firebase';

const CommentManager = (props) => {

    const [comments, setComments] = useState([]);



    const getDraftComments = async(commentStatus) => {
        if (props.placeId === null) {
            return;
        }
		let commentList = [];
		const commentsRef = db.collection('places').doc(props.placeId).collection('comments').where('status', '==', 0);
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


    const handleClickChangeStatusButton = async(status, commentId) => {
        
        let commentDataToSave = {};
        commentDataToSave.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
        commentDataToSave.status = status;

        console.log(commentId, commentDataToSave);
        
        await db.collection('places').doc(props.placeId).collection('comments').doc(commentId).update(commentDataToSave)
        .then(() => {
            console.log('Saved');
        })
        .catch(error => {
            console.log(error);
        });
    }



    //On mount
	useEffect(() => {
		getDraftComments();
	}, []);


    let commentsUi =    <div className="notification is-warning">
                            You need to save this place before you can add comments.
                        </div>;

    if (props.placeId !== null) {
        commentsUi = <div>

            <ul className="commentsList">
            {comments.map(function(comment, i){
                return (
                    <li className="comment" key={i}>
                        {comment.data.comment}
                        <div className="field has-addons">
                            <p className="control">
                                <button className="button is-small" onClick={() =>  handleClickChangeStatusButton(0, comment.id)}>
                                    Draft
                                </button>
                            </p>
                            <p className="control">
                                <button className="button is-small" onClick={() =>  handleClickChangeStatusButton(1, comment.id)}>
                                    Live
                                </button>
                            </p>
                            <p className="control">
                                <button className="button is-small" onClick={() =>  handleClickChangeStatusButton(2, comment.id)}>
                                    Deleted
                                </button>
                            </p>
                        </div>
                    </li>
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