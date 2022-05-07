import React, { useState, useEffect } from 'react';

const PlaceListItem = (props) => {
  return (
    <div>
      <strong>{props.place.data.name}</strong> <small>{props.place.data.description}</small>
    </div>
  );
}

export default PlaceListItem;
