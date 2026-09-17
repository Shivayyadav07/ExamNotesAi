 
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
 
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "authexamnotes-fa470.firebaseapp.com",
  projectId: "authexamnotes-fa470",
  storageBucket: "authexamnotes-fa470.firebasestorage.app",
  messagingSenderId: "958957598839",
  appId: "1:958957598839:web:bbe3dd4433e23fa5916e72"
};

 

const app = initializeApp(firebaseConfig);

const auth =getAuth(app)

const provider  =new GoogleAuthProvider()

export {auth,provider}