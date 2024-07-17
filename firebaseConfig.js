import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc, getFirestore, collection, addDoc } from "firebase/firestore"; 



const firebaseConfig = {
    apiKey: "AIzaSyCWK-KEUDln6Ks3rDB1lNIwqsxkAoDXZNI",
    authDomain: "meditest-32bcc.firebaseapp.com",
    projectId: "meditest-32bcc",
    storageBucket: "meditest-32bcc.appspot.com",
    messagingSenderId: "379523953419",
    appId: "1:379523953419:web:3881c3f34906b284ae280e",
    measurementId: "G-QQFC53G1LY"
  };

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// const analytics = getAnalytics(app);
const db = getFirestore(app);




// Initialize Firebase Authentication and get a reference to the service
// const auth = getAuth(app);
module.exports = {app, auth, db}