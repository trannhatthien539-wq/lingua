// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbfWmStltxB9l8YC5ySE7jtffqU1J3hBY",
  authDomain: "lingua-49fc1.firebaseapp.com",
  projectId: "lingua-49fc1",
  storageBucket: "lingua-49fc1.firebasestorage.app",
  messagingSenderId: "138926081617",
  appId: "1:138926081617:web:4d64b990f6dfc6c9e41a70",
  measurementId: "G-JG9KNJ4Y4Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);