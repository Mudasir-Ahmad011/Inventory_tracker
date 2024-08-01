// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWIW93GQJgK2alEh3J4YV_pBE_96jpXLk",
  authDomain: "inventory-management-cbd1a.firebaseapp.com",
  projectId: "inventory-management-cbd1a",
  storageBucket: "inventory-management-cbd1a.appspot.com",
  messagingSenderId: "578794814467",
  appId: "1:578794814467:web:ee632e92ef321151d0e236",
  measurementId: "G-F1B7J89W4S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore};