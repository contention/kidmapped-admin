import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { db } from '../lib/firebase';


const CommentListItem = (props) => {

	const [commentStatus, setCommentStatus] = useState(props.comment.data.status);

	const handleClickChangeStatusButton = async(commentStatus, commentId) => {

        let commentDataToSave = {};
        commentDataToSave.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
        commentDataToSave.status = commentStatus;

        console.log(commentId, commentDataToSave);
        
        await db.collection('places').doc(props.placeId).collection('comments').doc(commentId).update(commentDataToSave)
        .then(() => {
			setCommentStatus(commentStatus);
            console.log('Saved');
        })
        .catch(error => {
            console.log(error);
        });
    }

	let draftButtonClassName, liveButtonClassName, deletedButtonClassName;
	switch(commentStatus) {
		case 0:
			draftButtonClassName = 'is-dark'
			liveButtonClassName = '';
			deletedButtonClassName = '';
		  break;
		case 1:
			draftButtonClassName = ''
			liveButtonClassName = 'is-success';
			deletedButtonClassName = '';
		  break;
		case 2:
			draftButtonClassName = ''
			liveButtonClassName = '';
			deletedButtonClassName = 'is-danger';
		break;
		default:
			draftButtonClassName = 'is-dark'
			liveButtonClassName = '';
			deletedButtonClassName = '';
	  }

	  let displayDate = new Date(props.comment.data.createdAt.seconds*1000).toUTCString();


	return (
		<li className="comment">
			<div className="field has-addons is-pulled-right">
				<p className="control">
					<button className={"button is-small " + draftButtonClassName} onClick={() =>  handleClickChangeStatusButton(0, props.comment.id)}>
						Draft
					</button>
				</p>
				<p className="control">
					<button className={"button is-small " + liveButtonClassName} onClick={() =>  handleClickChangeStatusButton(1, props.comment.id)}>
						Live
					</button>
				</p>
				<p className="control">
					<button className={"button is-small " + deletedButtonClassName} onClick={() =>  handleClickChangeStatusButton(2, props.comment.id)}>
						Deleted
					</button>
				</p>
			</div>
			{props.comment.data.comment}
			<br /><small>Created on {displayDate}</small>
			
			
		</li>

	);
}

export default CommentListItem;