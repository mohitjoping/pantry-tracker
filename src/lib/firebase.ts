// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0_oiKtzpQGdg-FvtEt_Q3jULUr39UJCA",
  authDomain: "pantry-tracker-dc45a.firebaseapp.com",
  projectId: "pantry-tracker-dc45a",
  storageBucket: "pantry-tracker-dc45a.appspot.com",
  messagingSenderId: "743774365619",
  appId: "1:743774365619:web:5b0b359c5ac1ab9ad94dc6",
  measurementId: "G-VNEEJQLMD4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

export { db, auth, provider, signInWithPopup, storage };