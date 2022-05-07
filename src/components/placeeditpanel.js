import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';




const PlaceEditPanel = (props) => {

  const [placeData, setPlaceData] = useState(props.place.data);
  

  const handleChange = (e) => {
    setPlaceData({...placeData, [e.target.name] : e.target.value })
  }

  const handleSave = (e) => {
    e.preventDefault();
    console.log(placeData);
  }

  //Get place
  /*
  let getPlace = async() => {
    const placeRef = db.collection('places').doc(props.id);
    const doc = await placeRef.get();
    if (!doc.exists) {
      console.log('No such document!');
      return;
    } else {
      setForm(<PlaceEditForm placeData={doc.data()} />);
    }
  }
*/

  //On mount
  useEffect(() => {
    setPlaceData(props.place.data);
  }, [props]);




  return (
    <div>
      Place Edit Panel ({props.place.id})

      <form onSubmit={handleSave}>
        <label>Name:
          <input
            type="text" 
            name="name"
            value={placeData.name}
            onChange={handleChange}
          />
        </label>

        <label>Description:
          <textarea
            name="description"
            value={placeData.description}
            onChange={handleChange}
          />
        </label>

        <input type="submit" value="Save" />

      </form>

    </div>
  );
}

export default PlaceEditPanel;
