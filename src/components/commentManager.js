import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { db } from '../lib/firebase';

const CommentManager = (props) => {

    let draftView = {commentStatus: 0, draftTabClassName: 'is-active', liveTabClassName: ''};
    let liveView = {commentStatus: 1, draftTabClassName: '', liveTabClassName: 'is-active'};

    const [viewStatus, setViewStatus] = useState(draftView);


    const getComments = async() => {
		let commentList = [];
		const commentsRef = db.collection('places').doc(props.placeId).collection('comments').where('status', '==', viewStatus.commentStatus);
		const snapshot = await commentsRef.get();
		if (snapshot.empty) {
			console.log('No matching comments.');
			return;
		}
		snapshot.forEach(doc => {
			console.log(doc.data());
		});
	}



    //On mount
	useEffect(() => {
		getComments();
	}, [viewStatus.commentStatus]);



    return (
        <div className="box">
            <h3>Comments</h3>
            <div className="tabs">
            <ul>
                <li className={viewStatus.draftTabClassName}>
                    <a className="" onClick={() => setViewStatus(draftView)}>Draft</a>
                </li>
                <li className={viewStatus.liveTabClassName}>
                    <a className="" onClick={() => setViewStatus(liveView)}>Live</a>
                </li>
            </ul>
            </div>
        </div>
    );

}

export default CommentManager;