import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAbTI2SUmZZVd-CdetR0beRghbUXMfCZ_U",
    authDomain: "testqr-e1442.firebaseapp.com",
    projectId: "testqr-e1442",
    storageBucket: "testqr-e1442.firebasestorage.app",
    messagingSenderId: "895632964928",
    appId: "1:895632964928:web:78b21250cf1f8f7ebb4ea5",
    measurementId: "G-0VDL9PGVTQ"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);



