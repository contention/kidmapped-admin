import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { auth } from './lib/firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

//CSS
import './css/App.css';

//Screens
import HomeScreen from './screens/homescreen';
import PlacesScreen from './screens/placesscreen';
import EditScreen from './screens/editscreen';


//Auth
const uiConfig = {
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
  callbacks: {
    signInSuccessWithAuthResult: () => false,
  },
}


const App = () => {

  const handleClickHomeButton = () => {
    setCurrentScreen(<HomeScreen />);
  }

  const handleClickPlacesButton = () => {
    setCurrentScreen(<PlacesScreen handleClickEditButton={handleClickEditButton} handleClickCreateButton={handleClickCreateButton} />);
  }

  const handleClickEditButton = (place) => {
    setCurrentScreen(<EditScreen handleClickPlacesButton={handleClickPlacesButton} place={place} user={user} initialAction="edit" />);
  }

  const handleClickCreateButton = () => {
    setCurrentScreen(<EditScreen handleClickPlacesButton={handleClickPlacesButton} place={null} user={user} initialAction="create" />);
  }

  const handleClickSignInButton = () => {
    setAuthUi(<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />)
  }

  const handleClickSignOutButton = () => {
    firebase.auth().signOut();
    setUser(null);
    setCurrentScreen(<HomeScreen />);
  }


  
  const homeButtonContent = <button className="button" onClick={handleClickHomeButton}>Home</button>;

  const signInButtonContent = <button className="button is-success" onClick={handleClickSignInButton}>Sign in</button>;

  const signOutButtonContent = <button className="button is-danger" onClick={handleClickSignOutButton}>Sign out</button>;

  const controlButtonsContent = 
      <span>
        <button className="button" onClick={handleClickPlacesButton}>Places</button>
      </span>;



  //State
  const [currentScreen, setCurrentScreen] = useState(<HomeScreen />);

  const [homeButton, setHomeButton] = useState(homeButtonContent);

  const [authButton, setAuthButton] = useState(signInButtonContent);

  const [controlButtons, setControlButtons] = useState(null);

  const [authUi, setAuthUi] = useState(null);

  const [user, setUser] = useState(null);

  


  useEffect(() => {
    const authListener = firebase.auth().onAuthStateChanged(function(user) {
      
      if (user === null) {
        setControlButtons(null);
        setAuthButton(signInButtonContent);
      } else {
        setUser(user);
        setControlButtons(controlButtonsContent);
        setAuthButton(signOutButtonContent);
      }
      
    });
  }, []);


  

  return (
  <div>

    <nav className="navbar is-dark" role="navigation" aria-label="main navigation">
    	<div className="navbar-brand">
        	KM
      	</div>
      	<div className="navbar-menu">

		  	<div className="navbar-start">
			  	<div className="buttons">
				  	{homeButton}
					{controlButtons}
				</div>
			</div>

			<div className="navbar-end">
			  	<div className="buttons">
				  	{authButton}
				</div>
			</div>
       
    	</div>
    </nav>


    {currentScreen}

    {authUi}
    
  </div>
  );

}

const appContainer = document.getElementById('app');
const root = createRoot(appContainer);
root.render(<App />);