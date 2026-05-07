import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB3K6h-MouYevse_o9fuij8TxEpyCfDAeM",
    authDomain: "hiregenius-8d715.firebaseapp.com",
    projectId: "hiregenius-8d715",
    storageBucket: "hiregenius-8d715.firebasestorage.app",
    messagingSenderId: "236374208995",
    appId: "1:236374208995:web:ba70ae33d3f2c5cfc7b0d6",
    measurementId: "G-ZT58KPMP8K"
  };

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };