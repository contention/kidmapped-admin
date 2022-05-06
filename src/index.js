import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { auth } from './lib/firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

//Screens
import HomeScreen from './screens/homescreen';
import PlacesScreen from './screens/placesscreen';


//Auth
const uiConfig = {
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
  callbacks: {
    signInSuccessWithAuthResult: () => false,
  },
}

const App = () => {

  let handleClickHomeButton = () => {
    setCurrentScreen("homescreen");
  }

  let handleClickSignInButton = () => {
    setAuthUi(<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />)
  }

  let handleClickSignOutButton = () => {
    firebase.auth().signOut();
    setuser(null);
    setCurrentScreen("homescreen");
  }

  //State
  const [currentScreen, setCurrentScreen] = useState("homescreen");

  const [homeButton, setHomeButton] = useState(<button onClick={handleClickHomeButton}>Home</button>);

  const [authButton, setAuthButton] = useState(<button onClick={handleClickSignInButton}>Sign in</button>);

  const [controlButtons, setControlButtons] = useState(null);


  const [authUi, setAuthUi] = useState(null);

  const [user, setuser] = useState(null);

  let controlButtonsContent = <span><button onClick={() => setCurrentScreen("placesscreen")}>Places</button></span>;


  useEffect(() => {
    const authListener = firebase.auth().onAuthStateChanged(function(user) {
      
      if (user === null) {
        setControlButtons(null);
        setAuthButton(<button onClick={handleClickSignInButton}>Sign in</button>);
      } else {
        setuser(user);
        setControlButtons(controlButtonsContent);
        setAuthButton(<button onClick={handleClickSignOutButton}>Sign out</button>);
        setCurrentScreen("placesscreen");
      }
      
    });
  }, []);


  let currentScreenComponent = null;
  switch (currentScreen) {
    case "homescreen":
        currentScreenComponent = <HomeScreen />;
        break;
    case "placesscreen":
        currentScreenComponent = <PlacesScreen user={user} />;
        break;
    default:
      currentScreenComponent = <HomeScreen />;
  }

  

  return (
  <div>

    <div>
      {homeButton} {controlButtons} {authButton}
    </div>

    <hr />
    {currentScreenComponent}

    {authUi}
    
  </div>
  );

}

const appContainer = document.getElementById('app');
const root = createRoot(appContainer);
root.render(<App />);