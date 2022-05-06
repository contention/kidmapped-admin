import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';

const PlacesScreen = (props) => {

  let placeList = [];
  const [places, setPlaces] = useState([]);

  useEffect(() => {

        db.collection('places')
        .where('status', '==', 1)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                let place = {}
                place.data = doc.data();
                place.id = doc.id;
                placeList.push(place);
            });
            
        }).then(function(){
          setPlaces(placeList);
          console.log(placeList);
        })
        .catch(error => {
            //Nothing found

            //Show message popup
            console.log('Error - ' + error.message);
        })
      

  }, []);

  


  return (
    <div className="test">
      Places screen. 

      <ul>
      {places.map(function(p, i){
         return (<li key={i}>{p.data.name}</li>)
       })}
      </ul>
    </div>
  );
}

export default PlacesScreen;
