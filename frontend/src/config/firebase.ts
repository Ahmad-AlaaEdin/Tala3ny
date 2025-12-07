import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import {
  doc,
  setDoc,
  getDoc,
  where,
  collection,
  addDoc,
  query,
  getDocs,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
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
const messaging = getMessaging(app);
const db = getFirestore(app);
export {
  messaging,
  getToken,
  onMessage,
  doc,
  setDoc,
  getDoc,
  db,
  where,
  collection,
  query,
  addDoc,
  getDocs,
};
