// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmUCsqYW0SeE9eK6Ix3EIfxN2U4Ljcw2k",
  authDomain:"hear-me-fc3db.firebaseapp.com",
  projectId: "hear-me-fc3db",
  storageBucket: "hear-me-fc3db.appspot.com",
  messagingSenderId: "116758683301",
  appId: "1:116758683301:web:32d863bd9b370a7da4374c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)});
export const database = getFirestore();