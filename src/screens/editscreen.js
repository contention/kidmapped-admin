import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import GoogleMapReact from 'google-map-react';
import { db } from '../lib/firebase';


const EditScreen = (props) => {

	let initialPlaceData = {};
	let initialPlaceId = null;
	let initialLocation = {};
	initialLocation.lat = 55;
	initialLocation.lng = -2;


	if (props.place !== null) {
		initialPlaceData = props.place.data;
		initialPlaceId = props.place.id;
		initialLocation = props.place.data.location;
	}


	const [center, setCenter] = useState(initialLocation);
	const [zoom, setZoom] = useState(15);
	

	const [placeData, setPlaceData] = useState(initialPlaceData);
	const [placeId, setPlaceId] = useState(initialPlaceId);
	const [user, setUser] = useState(null);
	const [currentAction, setCurrentAction] = useState(props.initialAction);
	

	const handleChange = (e) => {

		let value = 0;

		if (e.target.name === 'status') {
			value = parseInt(e.target.value);
		} else {
			value = e.target.value;
		}

		setPlaceData({...placeData, [e.target.name] : value });
	}



	const handleCheckChange = (e) => {

		setPlaceData({...placeData, [e.target.name] : !placeData[e.target.name] });	
	}

	const handleMapChange = (e) => {
		setPlaceData({...placeData, location : e.center });
	}



	const handleSave = async(e) => {
		console.log('data to save:', placeData);
		console.log('id to save:', placeId);
		e.preventDefault();

		let placeDataToSave = placeData;

		placeDataToSave.updatedAt = firebase.firestore.FieldValue.serverTimestamp();

		if (placeId === null) {
			//Spoofing
			placeDataToSave.geohash = 'iowiueriuw';

			placeDataToSave.createdAt = firebase.firestore.FieldValue.serverTimestamp();
			placeDataToSave.uid = user.uid;

			try {
				const result = await db.collection('places').add(placeDataToSave);
				console.log('Added document with ID: ', result.id);
				setPlaceId(result.id);
				setCurrentAction("edit");
			} catch (e) {
				console.log(e);
			}

		} else {
			await db.collection('places').doc(placeId).set(placeDataToSave)
			.then(() => {
				console.log('Saved');
			})
			.catch(error => {
					console.log(error);
			});
						  
		}
		

	}



	const getComments = async() => {
		let placeList = [];
		const commentsRef = db.collection('places').doc(placeId).collection('comments');
		const snapshot = await commentsRef.get();
		if (snapshot.empty) {
			console.log('No matching documents.');
			return;
		}
		snapshot.forEach(doc => {
			console.log(doc.data());
		});
		
	}





	//On mount
	useEffect(() => {


		//getComments();






		if (props.initialAction === "create") {
			document.getElementById("placeForm").reset();
		}

		setPlaceData(initialPlaceData);

		const authListener = firebase.auth().onAuthStateChanged(function(user) {
      
			if (user === null) {
			} else {
			  setUser(user);
			}
			
		  });


	}, [props]);




	return (
		<section className="section content">
			<div className="container-fluid">
				<h1>{placeData.name}</h1>

				<form id="placeForm" onSubmit={handleSave}>


					<div className="field">
						<label className="label">Name</label>
						<div className="control">
							<input
								className="input"
								type="text" 
								name="name"
								value={placeData.name}
								onChange={handleChange}
							/>
						</div>
					</div>

					<hr />
					<div style={{ height: '50vh', width: '100%' }}>
						<GoogleMapReact
						bootstrapURLKeys={{ key: "AIzaSyB7qj1yC5veS8CeTMVa3xDLJ4HMH4Z8vuM" }}
						defaultCenter={center}
						defaultZoom={zoom}
						onChange={handleMapChange}
						>
						</GoogleMapReact>
					</div>
					<hr />



					<div className="field">
						<label className="label">Description</label>
						<div className="control">
							<textarea
								className="textarea"
								name="description"
								value={placeData.description}
								onChange={handleChange}
							/>
						</div>
					</div>

					<hr />

					<div className="field">
						<label className="label">Status</label>
						<div className="control">
							<label className="radio">
								<input
									type="radio"
									name="status"
									value={0}
									checked={placeData.status === 0}
									onChange={handleChange} /> <span className="tag is-dark">Draft</span>
							</label>
							<label className="radio">
								<input
									type="radio"
									name="status"
									value={1}
									checked={placeData.status === 1}
									onChange={handleChange} /> <span className="tag is-success">Live</span>
							</label>
							<label className="radio">
								<input
									type="radio"
									name="status"
									value={2}
									checked={placeData.status === 2}
									onChange={handleChange} /> <span className="tag is-warning">Flagged</span>
							</label>
							<label className="radio">
								<input
									type="radio"
									name="status"
									value={3}
									checked={placeData.status === 3}
									onChange={handleChange} /> <span className="tag is-danger">Deleted</span>
							</label>
						</div>
					</div>

					<hr />

					<div className="field">
						<label className="label">Environment</label>
						<label className="checkbox">
							<input
								type="checkbox"
								name="indoor"
								value="indoor"
								checked={placeData.indoor}
								onChange={handleCheckChange} /> Indoor
						</label>
						<br />
						<label className="checkbox">
							<input
								type="checkbox"
								name="outdoor"
								value="outdoor"
								checked={placeData.outdoor}
								onChange={handleCheckChange} /> Outdoor
						</label>
					</div>

					<hr />


					<div className="field">
						<label className="label">Cost</label>
						<label className="checkbox">
							<input
								type="checkbox"
								name="paid"
								value="paid"
								checked={placeData.paid}
								onChange={handleCheckChange} /> Paid
						</label>
						<br />
						<label className="checkbox">
							<input
								type="checkbox"
								name="free"
								value="free"
								checked={placeData.free}
								onChange={handleCheckChange} /> Free
						</label>
					</div>

					<hr />

					<div className="field">
						<label className="label">Opening times</label>
						<div className="control">
							<textarea
								className="textarea"
								name="openingTimes"
								value={placeData.openingTimes}
								onChange={handleChange}
							/>
						</div>
					</div>

					<hr />

					<div className="field">
						<label className="label">Address</label>
						<div className="control">
							<textarea
								className="textarea"
								name="address"
								value={placeData.address}
								onChange={handleChange}
							/>
						</div>
					</div>

					<div className="field">
						<label className="label">Phone</label>
						<div className="control">
							<input
								className="input"
								type="text" 
								name="phone"
								value={placeData.phone}
								onChange={handleChange}
							/>
						</div>
					</div>

					<div className="field">
						<label className="label">Email</label>
						<div className="control">
							<input
								className="input"
								type="text" 
								name="email"
								value={placeData.email}
								onChange={handleChange}
							/>
						</div>
					</div>

					<div className="field">
						<label className="label">URL</label>
						<div className="control">
							<input
								className="input"
								type="text" 
								name="url"
								value={placeData.url}
								onChange={handleChange}
							/>
						</div>
					</div>




					<hr />

					<input className="button is-success" type="submit" value="Save" /> 
					<button className="button is-danger is-inverted" onClick={props.handleClickPlacesButton}>Cancel</button>

				</form>

				

			</div>
		</section>

	);
}

export default EditScreen;
