import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';

import PlaceListItem from '../components/placelistitem';

const PlacesScreen = (props) => {

	//New places
	const [newPlaces, setNewPlaces] = useState([]);
	const getNewPlaces = async() => {
		let placeList = [];
		const placesRef = db.collection('places').where('status', '==', 0);
		const snapshot = await placesRef.get();
		if (snapshot.empty) {
			console.log('No matching places.');
			return;
		}
		snapshot.forEach(doc => {
			let place = {}
			place.data = doc.data();
			place.id = doc.id;
			placeList.push(place);
		});
		setNewPlaces(placeList);
	}


	//New comments
	const [newComments, setNewComments] = useState([]);
	const getNewComments = async() => {
		let commentList = [];
		const commentsRef = db.collectionGroup('comments');
		const snapshot = await commentsRef.get();
		if (snapshot.empty) {
			console.log('No matching comments.');
			return;
		}
		snapshot.forEach(doc => {
			console.log('parent', doc.ref.parent.parent.id);
			let comment = {}
			comment.data = doc.data();
			comment.id = doc.id;
			commentList.push(comment);
			console.log(commentList);
		});
		setNewComments(commentList);
	}



	//Get all sections
	let getAll = () => {
		getNewPlaces();
		getNewComments();
	}


	//On mount
	useEffect(() => {
		getAll();
	}, []);



	return (
		<section className="section content">
			<div className="container-fluid">

				<div className="box">

					<form className="form">
						<div className="field is-grouped">
							<div className="control is-expanded">
								<input
									className="input"
									type="text"
									placeholder="Search for a place"
								/>
							</div>
							<div className="control">
								<button className="button is-info">
								Search
								</button>
							</div>
							<div className="control">
								<button className="button is-success" onClick={props.handleClickCreateButton}>Create</button>
							</div>
						</div>
					</form>
					
				</div>

				<div className="columns">

					<div className="column">

						<div className="box">
							<h2 className="dottedBorderBottom">New places</h2>
							<ul className="placeListItems">
							{newPlaces.map(function(place, i){
								return (
									<PlaceListItem key={i} place={place} handleClickEditButton={props.handleClickEditButton} />
								)
							})}
							</ul>
						</div>
					</div>


					<div className="column">
						<div className="box">
							<h2 className="dottedBorderBottom">New suggestions</h2>
							<ul className="placeListItems">
							
							</ul>
						</div>
					</div>


					<div className="column">
						<div className="box">
							<h2 className="dottedBorderBottom">New comments</h2>
							<ul className="placeListItems">
							{newComments.map(function(comment, i){
								return (
									<div></div>
									//<PlaceListItem key={i} place={comment} handleClickEditButton={props.handleClickEditButton} />
								)
							})}
							</ul>
						</div>
					</div>


				</div>
	


			 </div>
		</section>
	);
}

export default PlacesScreen;
