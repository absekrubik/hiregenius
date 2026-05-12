import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAN2OnJFVsMlbotv6d_zKfgE_L1Fru3oao",
    authDomain: "hiregenius-816ad.firebaseapp.com",
    projectId: "hiregenius-816ad",
    storageBucket: "hiregenius-816ad.firebasestorage.app",
    messagingSenderId: "295783800991",
    appId: "1:295783800991:web:29a2c1024c10bc17f202aa"
  };

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };