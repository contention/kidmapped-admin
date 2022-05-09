import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';

import PlaceListItem from '../components/placelistitem';

const PlacesScreen = (props) => {

	//New places
	const [newPlaces, setNewPlaces] = useState([]);
	const getNewPlaces = async() => {
		let placeList = [];
		const placesRef = db.collection('places');
		const snapshot = await placesRef.where('status', '==', 0).get();
		if (snapshot.empty) {
			console.log('No matching documents.');
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


	//Problem places
	const [problemPlaces, setProblemPlaces] = useState([]);
	const getProblemPlaces = async() => {
		let placeList = [];
		const placesRef = db.collection('places');
		const snapshot = await placesRef.get();
		if (snapshot.empty) {
			console.log('No matching documents.');
			return;
		}
		snapshot.forEach(doc => {
			let place = {}
			place.data = doc.data();
			place.id = doc.id;
			placeList.push(place);
		});
		setProblemPlaces(placeList);
	}



	//Get all sections
	let getAll = () => {
		getNewPlaces();
		getProblemPlaces();
	}


	//On mount
	useEffect(() => {
		getAll();
	}, []);



	return (
		<section className="section content">
			<div className="container-fluid">

			<div className="columns">

				<div className="column">
					<h2>Draft</h2>
					<ul className="placeListItems">
					{newPlaces.map(function(place, i){
						return (
							<PlaceListItem place={place} handleClickEditButton={props.handleClickEditButton} />
						)
					})}
					</ul>
				</div>


				<div class="column">
					<h2>Problem</h2>
					<ul className="placeListItems">
					{problemPlaces.map(function(place, i){
						return (
							<PlaceListItem place={place} handleClickEditButton={props.handleClickEditButton} />
						)
					})}
					</ul>
				</div>


			</div>
	


			 </div>
		</section>
	);
}

export default PlacesScreen;
