import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';

const EditScreen = (props) => {

  const [place, setPlace] = useState(null);

  useEffect(() => {

        db.collection('places')
        .where('status', '==', 1)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                let place = {}
                place.data = doc.data();
                place.id = doc.id;
            });
            
        }).then(function(){
          
        })
        .catch(error => {
            //Nothing found

            //Show message popup
            console.log('Error - ' + error.message);
        })
      

  }, []);

  


  return (
    <div>
      <h1>Edit</h1>
    </div>
  );
}

export default EditScreen;
