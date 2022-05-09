import React, { useState, useEffect } from 'react';

const PlaceStatusIndicator = (props) => {

    let statusName, className;

    switch(props.status) {
        case 0:
            statusName = 'Draft';
            className = 'tag is-dark';
            break;
        case 1:
            statusName = 'Live';
            className = 'tag is-success';
            break;
        case 2:
            statusName = 'Flagged';
            className = 'tag is-warning';
            break;
        case 3:
            statusName = 'Deleted';
            className = 'tag is-danger';
            break;  
        default:
            statusName = 'No status';
            className = 'tag is-light';
      }



  return (
    <span className={className}>{statusName}</span>
  );
}

export default PlaceStatusIndicator;
