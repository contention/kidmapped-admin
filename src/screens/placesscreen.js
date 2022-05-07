import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';

import PlaceListItem from '../components/placelistitem';
import PlaceEditPanel from '../components/placeeditpanel';

const PlacesScreen = (props) => {


  //Place Edit Panel
  const [placeEditPanel, setPlaceEditPanel] = useState(null);
  const [placeEditPanelCloseButton, setPlaceEditPanelCloseButton] = useState(null);

  let closePlaceEditPanel = () => {
    setPlaceEditPanel(null);
    setPlaceEditPanelCloseButton(null)
    
  }

  let showPlaceEditPanel = (place, hidePlaceEditPanel) => {
    setPlaceEditPanel(<PlaceEditPanel place={place} />);
    setPlaceEditPanelCloseButton(<button onClick={closePlaceEditPanel}>Close</button>);
  }

  
   
  //Places
  let placeList = [];
  const [places, setPlaces] = useState([]);


  //Get new place
  let getNewPlaces = async() => {
    const placesRef = db.collection('places');
    const snapshot = await placesRef.where('status', '==', 1).get();
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
    setPlaces(placeList);
  }


  //Get all sections
  let getAll = () => {
    getNewPlaces();
  }


  //On mount
  useEffect(() => {
    getAll();
  }, []);




  return (
    <div>

      <div>
      {placeEditPanelCloseButton}
      {placeEditPanel}
      </div>


      <h1>Places</h1> 

      <h2>New places</h2>
      <ul>
      {places.map(function(place, i){
         return (<PlaceListItem key={i} place={place} showPlaceEditPanel={showPlaceEditPanel} />)
       })}
      </ul>
    </div>
  );
}

export default PlacesScreen;
