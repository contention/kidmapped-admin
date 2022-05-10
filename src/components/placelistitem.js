import React, { useState, useEffect } from 'react';

import PlaceStatusIndicator from './placeStatusIndicator';

const PlaceListItem = (props) => {

	return (
		<li className="placeListItem">
			<div className="columns">
				<div className="column">
				<strong>{props.place.data.name}</strong> <PlaceStatusIndicator status={props.place.data.status} />
					<br /><small>{props.place.data.description}</small>
				</div>
				<div className="column is-one-fifth">
					<button className="button is-info is-small is-pulled-right" onClick={() => props.handleClickEditButton(props.place)}>Edit</button>
				</div>
			</div>
		</li>

	);
}

export default PlaceListItem;
