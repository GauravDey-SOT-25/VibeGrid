// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyg0uSASFaGh1m6MX-o3LtWhm7Aidymw4",
  authDomain: "event-listing-platform-105f5.firebaseapp.com",
  projectId: "event-listing-platform-105f5",
  storageBucket: "event-listing-platform-105f5.firebasestorage.app",
  messagingSenderId: "864123087090",
  appId: "1:864123087090:web:8b93eecc253429e94ec86b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
const db = getFirestore(app);

// Export the database
export { db };