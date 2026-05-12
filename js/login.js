import { db } from "./firebase-config.js";

import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const auth = getAuth();

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", function () {
  navMenu.classList.toggle("active");
});

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  loginMessage.textContent = "";

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      loginMessage.textContent = "User profile not found.";
      return;
    }

    const userData = userSnap.data();

    loginMessage.textContent = "Login successful.";
    loginMessage.classList.add("success");

    setTimeout(() => {
      if (userData.role === "employer") {
        window.location.href = "employer-dashboard.html";;
      } else {
        window.location.href = "jobseeker-dashboard.html";
      }
    }, 1000);

  } catch (error) {
    console.error(error);

    loginMessage.textContent = "Invalid email or password.";
    loginMessage.classList.remove("success");
  }
});