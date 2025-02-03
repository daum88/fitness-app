// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC7FVoafnVbD2XM59DzKfu1p2MXf_4xF7I",
    authDomain: "coachapp-76f23.firebaseapp.com",
    projectId: "coachapp-76f23",
    storageBucket: "coachapp-76f23.firebasestorage.app",
    messagingSenderId: "237606069157",
    appId: "1:237606069157:web:62ac4ca56e121716ebfe4c",
    measurementId: "G-VCT55GFQ5K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics
const analytics = getAnalytics(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Export Firebase app (if needed)
export default app;
