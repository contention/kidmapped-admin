import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Initialize Firebase
let firebaseConfig = {
    apiKey: "AIzaSyB7qj1yC5veS8CeTMVa3xDLJ4HMH4Z8vuM",
    authDomain: "kidmapped.firebaseapp.com",
    databaseURL: "https://kidmapped.firebaseio.com",
    projectId: "kidmapped",
    storageBucket: "kidmapped.appspot.com",
    messagingSenderId: "176377393312",
    appId: "1:176377393312:web:762f69bdfc3169bdba99c5",
    measurementId: "G-QJ5K8BTFWV"
  };
   
// Use this to initialize the firebase App
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Use these for db & auth
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { auth, db };
