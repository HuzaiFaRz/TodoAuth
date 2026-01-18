import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  updateDoc,
  orderBy,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";


// import {
//   getStorage,
//   ref,
//   uploadBytes,
//   getDownloadURL,
// } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";

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
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
// const storage = getStorage(app);

const showToast = (massege, background, duration) => {
  Toastify({
    text: `${massege}`,
    position: "center",
    duration: `${duration}`,
    style: {
      background: `${background}`,
      color: "#fbfcf8",
      fontSize: "18px",
      letterSpacing: "2px",
    },
  }).showToast();
};

export {
  showToast,
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  provider,
  db,
  // storage,
  doc,
  setDoc,
  getDoc,
  getDocs,
  // ref,
  // uploadBytes,
  // getDownloadURL,
  addDoc,
  collection,
  query,
  where,
  deleteDoc,
  updateDoc,
  orderBy,
  serverTimestamp,
};
