import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { auth } from './lib/firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

//Screens
import HomeScreen from './screens/homescreen';
import TestScreen from './screens/testscreen';


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
  }

  //State
  const [currentScreen, setCurrentScreen] = useState("homescreen");

  const [homeButton, setHomeButton] = useState(<a href="#" onClick={handleClickHomeButton}>Home</a>);

  const [authButton, setAuthButton] = useState(<a href="#" onClick={handleClickSignInButton}>Sign in</a>);

  const [controlButtons, setControlButtons] = useState(<span></span>);


  const [authUi, setAuthUi] = useState(null);


  useEffect(() => {
    const authListener = firebase.auth().onAuthStateChanged(function(user) {
      
      if (user === null) {
        setControlButtons(<span></span>);
        setAuthButton(<a href="#" onClick={handleClickSignInButton}>Sign in</a>);
      } else {
        setControlButtons(<span><a href="#" onClick={() => setCurrentScreen("testscreen")}>Test</a></span>);
        setAuthButton(<a href="#" onClick={handleClickSignOutButton}>Sign out</a>);
      }
      
    });
  }, []);


  let currentScreenComponent = null;
  switch (currentScreen) {
    case "homescreen":
        currentScreenComponent = <HomeScreen />;
        break;
    case "testscreen":
        currentScreenComponent = <TestScreen user="cheese" />;
        break;
    default:
      currentScreenComponent = <HomeScreen />;
  }

  

  return (
  <React.StrictMode>

    <div>
      {homeButton} | {controlButtons} | {authButton}
    </div>

    <hr />
    {currentScreenComponent}

    {authUi}
    
  </React.StrictMode>
  );

}

const appContainer = document.getElementById('app');
const root = createRoot(appContainer);
root.render(<App />);