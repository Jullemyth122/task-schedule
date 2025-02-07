// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth'; // Added Google and Facebook auth
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBvH4dDT31I5Lq6CXFSNmDmpcXj__GPxBE",
  authDomain: "task-scheduler-4b0ec.firebaseapp.com",
  projectId: "task-scheduler-4b0ec",
  storageBucket: "task-scheduler-4b0ec.appspot.com",
  messagingSenderId: "125863140703",
  appId: "1:125863140703:web:78edd27a41b71107b06aea",
  measurementId: "G-NQV189QH05"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Firebase providers for Google and Facebook
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();



export { auth, db, googleProvider, facebookProvider };
