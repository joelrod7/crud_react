// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtxKjoGUXR18WQEv9AgtjmGTwOsj1qo4M",
  authDomain: "crud-web2-6079f.firebaseapp.com",
  projectId: "crud-web2-6079f",
  storageBucket: "crud-web2-6079f.appspot.com",
  messagingSenderId: "780210461896",
  appId: "1:780210461896:web:5f54e6f0be2a4dd20f19fd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
export {db}