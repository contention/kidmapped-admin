import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';

import PlaceEditForm from './placeeditform';


const PlaceEditPanel = (props) => {

  const [form, setForm] = useState(null);


  //Get place
  let getPlace = async() => {
    const placeRef = db.collection('places').doc(props.id);
    const doc = await placeRef.get();
    if (!doc.exists) {
      console.log('No such document!');
      return;
    } else {
      console.log(doc.data());
      setForm(<PlaceEditForm data={doc.data()} />);
    }
  }


  //On mount
  useEffect(() => {
    getPlace();
  }, [props]);




  return (
    <div>
      Place Edit Panel ({props.id})

      {form}

    </div>
  );
}

export default PlaceEditPanel;
