import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyDMskxzV8Md7OLmdzyknzxMjw-W-BLkR1Y",
  authDomain: "authdash-ae8c0.firebaseapp.com",
  projectId: "authdash-ae8c0",
  storageBucket: "authdash-ae8c0.appspot.com",
  messagingSenderId: "815513332044",
  appId: "1:815513332044:web:da3a17da9373fd5b7787e9",
  measurementId: "G-S0XNN139BP",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  db,
  collection,
  addDoc,
  getDocs,
};


