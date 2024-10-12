// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBUOOoWPgi0tq90XFMBdWInfXN1j5yApdg",
  authDomain: "ecs-elite-club.firebaseapp.com",
  databaseURL: "https://ecs-elite-club-default-rtdb.firebaseio.com",
  projectId: "ecs-elite-club",
  storageBucket: "ecs-elite-club.appspot.com", // Storage bucket
  messagingSenderId: "761990588595",
  appId: "1:761990588595:web:24b24200da0d623cd4e8c6",
  measurementId: "G-YZLT3SQ8XX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const realtimeDB = getDatabase(app); // Initialize Firebase Realtime Database
const storage = getStorage(app); // Initialize Firebase Storage

// Export the Firebase services you need
export { app, auth, provider, db, realtimeDB, storage }; // Export storage
