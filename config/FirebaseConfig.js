// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "pet-project-e733c.firebaseapp.com",
  projectId: "pet-project-e733c",
  storageBucket: "pet-project-e733c.firebasestorage.app",
  messagingSenderId: "771121167963",
  appId: "1:771121167963:web:40aa993e8afbe632e8497e",
  measurementId: "G-DZ1BL0BE2X"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);
 export const db= getFirestore(app);
//const analytics = getAnalytics(app);