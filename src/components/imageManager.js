import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { db } from '../lib/firebase';
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";

const ImageManager = (props) => {

    //Testing image stuff
    /*
	const storage = getStorage();
	const imageRef = ref(storage, 'IMG_0940.jpeg');
	getDownloadURL(imageRef)
	.then((url) => {
		
		console.log(url);

		// Or inserted into an <img> element
		//const img = document.getElementById('myimg');
		//img.setAttribute('src', url);
	})
	.catch((error) => {
		console.log(error)
		// Handle any errors
	});
    */



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

    
    const uploadImage = async(e) => {
        e.preventDefault();
        console.log(e);

        console.log('uploading');
        const storage = getStorage();
	    const uploadedImageRef = ref(storage, props.placeId + '/IMG_0940.jpeg');

        const file = e.target[0].files[0];
        console.log(file);

        const fileData = await uploadBytes(uploadedImageRef, file);
        const imageSrc = await getDownloadURL(uploadedImageRef);
        console.log(uploadedImageRef, imageSrc);

        //Now create entry in db.



         /*
        await uploadBytes(uploadedImageRef, file).then((snapshot) => {
            console.log(snapshot);
            console.log('Uploaded a file!');
            const imageSrc = getDownloadURL(uploadedImageRef);
            console.log(imageSrc);
        })
        .catch(error => {
            console.log(error);
        });
        */


        /*
        var file = e.target.files[0];
        var storageRef = firebase.storage().ref('img/'+file.name);
        var task = storageRef.put(file);
        task.on('state_changed', function progress(snapshot) {
            var percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
            uploader.value = percentage;

        }, function error(err) {


        },function complete() {

        });

        return;

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
        */
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


    let imagesUi =    <div className="notification is-warning">
                            You need to save this place before you can manage images.
                        </div>;

    if (props.placeId !== null) {
        imagesUi = <div>

            <form onSubmit={uploadImage}>
            <div className="field">
                <label className="label">Upload</label>
                <div className="control">
                    <input type="file" name="uploadButton" id="uploadButton" />
                </div>
                <div className="control">
                    <input className="button is-success" type="submit" value="Save" />
                </div>
            </div>


            </form>

            <hr />


            <ul className="commentsList">
            {comments.map(function(comment, i){
                return (
                    <div></div>//<CommentListItem key={i} placeId={props.placeId} comment={comment}/>
                )
            })}
            </ul>

            <button className="button" onClick={getComments}>More</button>
        </div>
    }



    return (
        <div className="box">
            <h3>Images</h3>
            {imagesUi}
        </div>
    );

}

export default ImageManager;