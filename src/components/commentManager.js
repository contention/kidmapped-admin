import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { db } from '../lib/firebase';

const CommentManager = (props) => {

    let commentStatus = 0;

    let draftView = {draftTabClassName: 'is-active', liveTabClassName: ''};
    let liveView = {draftTabClassName: '', liveTabClassName: 'is-active'};

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
            </ul>
            </div>

            <ul>
            {comments.map(function(comment, i){
                return (
                    <li key={i}>{comment.data.comment}</li>
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