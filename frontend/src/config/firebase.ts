// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDa-gBADXDWnC6GxriBHGedHEl2xo7yhkQ",
  authDomain: "tala3ny-5e4d9.firebaseapp.com",
  projectId: "tala3ny-5e4d9",
  storageBucket: "tala3ny-5e4d9.firebasestorage.app",
  messagingSenderId: "76162891753",
  appId: "1:76162891753:web:e8038890d500db3530d578",
  measurementId: "G-XQ9KVES9WC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuth = new GoogleAuthProvider();
