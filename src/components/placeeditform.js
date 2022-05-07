import React, { useState, useEffect } from 'react';

const PlaceEditForm = (props) => {


  let handleChange = () => {
    console.log('changed');
  }

  return (
    <form>
        <label>Place name:
          <input
            type="text" 
            value={props.data.name}
            onChange={() => handleChange}
          />
        </label>

      </form>
  );
}

export default PlaceEditForm;