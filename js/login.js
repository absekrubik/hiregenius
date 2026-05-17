import { db } from "./firebase-config.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const googleLoginBtn = document.getElementById("googleLoginBtn");

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

    await redirectByRole(user.uid);

  } catch (error) {
    console.error(error);
    loginMessage.textContent = "Invalid email or password.";
    loginMessage.classList.remove("success");
  }
});

googleLoginBtn.addEventListener("click", async function () {
  loginMessage.textContent = "";

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        role: "jobseeker",
        fullName: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
        provider: "google",
        createdAt: new Date().toISOString()
      });
    }

    await redirectByRole(user.uid);

  } catch (error) {
    console.error(error);
    loginMessage.textContent = "Google login failed.";
    loginMessage.classList.remove("success");
  }
});

async function redirectByRole(uid) {
  const userRef = doc(db, "users", uid);
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
      window.location.href = "employer-dashboard.html";
    } else if (userData.role === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "jobseeker-dashboard.html";
    }
  }, 700);
}