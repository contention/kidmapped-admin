import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { db } from '../lib/firebase';

const CommentManager = (props) => {

    let commentStatus = 0;

    let draftView = {draftTabClassName: 'is-active', liveTabClassName: '', deletedTabClassName: ''};
    let liveView = {draftTabClassName: '', liveTabClassName: 'is-active', deletedTabClassName: ''};
    let deletedView = {draftTabClassName: '', liveTabClassName: '', deletedTabClassName: 'is-active'};

    const [viewStatus, setViewStatus] = useState(draftView);
    const [comments, setComments] = useState([]);


    const getComments = async(commentStatus) => {
        if (props.placeId === null) {
            return;
        }
		let commentList = [];
		const commentsRef = db.collection('places').doc(props.placeId).collection('comments').where('status', '==', commentStatus);
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



    const handleClickDraftButton = () => {
        setViewStatus(draftView);
        getComments(0);
      }

      const handleClickLiveButton = () => {
        setViewStatus(liveView);
        getComments(1);
      }

      const handleClickDeletedButton = () => {
        setViewStatus(deletedView);
        getComments(2);
      }

    const handleClickChangeStatusButton = async(status, commentId) => {
        
        let commentDataToSave = {};

        commentDataToSave.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
        commentDataToSave.status = status;

        console.log(commentId, commentDataToSave);
        
        await db.collection('places').doc(props.placeId).collection('comments').doc(commentId).update(commentDataToSave)
        .then(() => {
            console.log('Saved');
            getComments(commentStatus);
        })
        .catch(error => {
                console.log(error);
        });
                            
        
            
    
        
    }



    //On mount
	useEffect(() => {
		getComments(commentStatus);
	}, []);


    let commentsUi =    <div class="notification is-warning">
                            You need to save this place before you can add comments.
                        </div>;

    if (props.placeId !== null) {
        commentsUi = <div>
        <div className="tabs">
            <ul>
                <li className={viewStatus.draftTabClassName}>
                    <a className="" onClick={handleClickDraftButton}>Draft</a>
                </li>
                <li className={viewStatus.liveTabClassName}>
                    <a className="" onClick={handleClickLiveButton}>Live</a>
                </li>
                <li className={viewStatus.deletedTabClassName}>
                    <a className="" onClick={handleClickDeletedButton}>Deleted</a>
                </li>
            </ul>
            </div>

            <ul className="commentsList">
            {comments.map(function(comment, i){
                return (
                    <li className="comment" key={i}>
                        {comment.data.comment}
                        <div class="field has-addons">
                            <p class="control">
                                <button class="button is-small" onClick={() =>  handleClickChangeStatusButton(0, comment.id)}>
                                    Draft
                                </button>
                            </p>
                            <p class="control">
                                <button class="button is-small" onClick={() =>  handleClickChangeStatusButton(1, comment.id)}>
                                    Live
                                </button>
                            </p>
                            <p class="control">
                                <button class="button is-small" onClick={() =>  handleClickChangeStatusButton(2, comment.id)}>
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