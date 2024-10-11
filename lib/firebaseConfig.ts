import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBUOOoWPgi0tq90XFMBdWInfXN1j5yApdg",
  authDomain: "ecs-elite-club.firebaseapp.com",
  databaseURL: "https://ecs-elite-club-default-rtdb.firebaseio.com",
  projectId: "ecs-elite-club",
  storageBucket: "ecs-elite-club.appspot.com",
  messagingSenderId: "761990588595",
  appId: "1:761990588595:web:24b24200da0d623cd4e8c6",
  measurementId: "G-YZLT3SQ8XX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Initialize Firebase Realtime Database
const realtimeDB = getDatabase(app);

// Export the Firebase services you need
export { app, auth, provider, db, realtimeDB };
