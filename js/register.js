import { db } from "./firebase-config.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");
const googleRegisterBtn = document.getElementById("googleRegisterBtn");

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
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      role: role,
      fullName: fullName,
      email: email,
      provider: "email",
      createdAt: new Date().toISOString()
    });

    registerMessage.textContent = "Account created successfully.";
    registerMessage.classList.add("success");

    registerForm.reset();

    setTimeout(() => {
      if (role === "employer") {
        window.location.href = "employer-dashboard.html";
      } else {
        window.location.href = "jobseeker-dashboard.html";
      }
    }, 1000);

  } catch (error) {
    console.error(error);

    if (error.code === "auth/email-already-in-use") {
      registerMessage.textContent = "Email already exists.";
    } else if (error.code === "auth/weak-password") {
      registerMessage.textContent = "Password should be at least 6 characters.";
    } else {
      registerMessage.textContent = "Unable to create account.";
    }

    registerMessage.classList.remove("success");
  }
});

googleRegisterBtn.addEventListener("click", async function () {
  registerMessage.textContent = "";

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

    window.location.href = "jobseeker-dashboard.html";

  } catch (error) {
    console.error(error);
    registerMessage.textContent = "Google signup failed.";
    registerMessage.classList.remove("success");
  }
});