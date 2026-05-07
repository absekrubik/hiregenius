import { db } from "./firebase-config.js";

import {
  getAuth,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const auth = getAuth();

const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", function () {
  navMenu.classList.toggle("active");
});

registerForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const role = document.getElementById("userRole").value;
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  registerMessage.textContent = "";

  try {

    // CREATE FIREBASE AUTH ACCOUNT
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // SAVE USER DATA TO FIRESTORE
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      role: role,
      fullName: fullName,
      email: email,
      createdAt: new Date().toISOString()
    });

    registerMessage.textContent = "Account created successfully.";
    registerMessage.classList.add("success");

    registerForm.reset();

    // REDIRECT
    setTimeout(() => {

      if (role === "employer") {
        window.location.href = "employer-dashboard.html";;
      } else {
        window.location.href = "jobs.html";
      }

    }, 1500);

  } catch (error) {

    console.error(error);

    if (error.code === "auth/email-already-in-use") {
      registerMessage.textContent = "Email already exists.";
    }

    else if (error.code === "auth/weak-password") {
      registerMessage.textContent = "Password should be at least 6 characters.";
    }

    else {
      registerMessage.textContent = "Unable to create account.";
    }

    registerMessage.classList.remove("success");
  }
});