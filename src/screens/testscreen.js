import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const TestScreen = (props) => {

  console.log(props);

  useEffect(() => {

    console.log('ewewerw');


        db.collection('places')
        .where('status', '==', 1)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                let place = doc.data();
                console.log(place);
            });
            
        })
        .catch(error => {
            //Nothing found

            //Show message popup
            console.log('Error - ' + error.message);
        })
      

  }, []);

  


  return (
    <div className="test">
      Test screen. {props.user}
    </div>
  );
}

export default TestScreen;
