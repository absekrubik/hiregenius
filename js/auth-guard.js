import { db } from "./firebase-config.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const auth = getAuth();

export function protectPage(allowedRole) {

  return new Promise((resolve) => {

    onAuthStateChanged(auth, async function (user) {

      if (!user) {
        window.location.href = "login.html";
        return;
      }

      try {

        const userRef = doc(db, "users", user.uid);

        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          window.location.href = "login.html";
          return;
        }

        const userData = userSnap.data();

        if (userData.role !== allowedRole) {

          // WRONG ROLE
          if (userData.role === "employer") {
            window.location.href = "employer-dashboard.html";
          }

          else {
            window.location.href = "jobseeker-dashboard.html";
          }

          return;
        }

        resolve({
          user,
          userData
        });

      } catch (error) {

        console.error("Role protection error:", error);

        window.location.href = "login.html";
      }
    });
  });
} 