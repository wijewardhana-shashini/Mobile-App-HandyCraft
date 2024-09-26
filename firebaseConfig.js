// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyDOUa48owKkMiVQWsfvD3Bhdj0o6EjAN3A",
    authDomain: "hand-craft-ef0d3.firebaseapp.com",
    projectId: "hand-craft-ef0d3",
    storageBucket: "hand-craft-ef0d3.appspot.com",
    messagingSenderId: "878290564578",
    appId: "1:878290564578:web:06e15ecb7abb9cc31435bb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Auth and set persistence
const auth = initializeAuth(app, {
     persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Get storage instance
const storage = getStorage(app);

// Exporting Firebase app, Firestore instance, Auth instance, and Storage instance
export { app, db, auth, storage };



// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from 'firebase/storage';
// import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


// const firebaseConfig = {
//     apiKey: "AIzaSyDOUa48owKkMiVQWsfvD3Bhdj0o6EjAN3A",
//     authDomain: "hand-craft-ef0d3.firebaseapp.com",
//     projectId: "hand-craft-ef0d3",
//     storageBucket: "hand-craft-ef0d3.appspot.com",
//     messagingSenderId: "878290564578",
//     appId: "1:878290564578:web:06e15ecb7abb9cc31435bb"
// };
// //Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const firestore = getFirestore(app);
// const db = getFirestore(app);

// // Initialize Auth and set persistence
// const auth = initializeAuth(app, {
//     persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// });

// // Get storage instance
// const storage = getStorage(app);

// // Exporting Firebase app, Firestore instance, Auth instance, and Storage instance
// export { app, db, auth, storage , firestore };