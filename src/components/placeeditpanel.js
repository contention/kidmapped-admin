import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';




const PlaceEditPanel = (props) => {

  let initialplaceData = props.place.data;
  initialplaceData.uid = props.user.uid;
  const [placeData, setPlaceData] = useState(initialplaceData);
  

  const handleChange = (e) => {
    setPlaceData({...placeData, [e.target.name] : e.target.value })
  }

  const handleSave = async(e) => {
    console.log('data to save:', placeData);
    e.preventDefault();
    await db.collection('places').doc(props.place.id).set(placeData)
    .catch(error => {
        console.log(error);
    });

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
      <h1>Edit</h1>

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

      <hr />

    </div>

  );
}

export default PlaceEditPanel;
