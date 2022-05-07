import React, { useState, useEffect } from 'react';

const PlaceListItem = (props) => {
  return (
    <li>
      {props.place.data.name} <button onClick={() => props.showPlaceEditPanel(props.place.id, props.hidePlaceEditPanel)}>Edit</button>
    </li>
  );
}

export default PlaceListItem;
