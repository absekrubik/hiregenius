import { db } from "./firebase-config.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const postJobForm = document.getElementById("postJobForm");
const postJobMessage = document.getElementById("postJobMessage");

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", function () {
  navMenu.classList.toggle("active");
});

postJobForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const newJob = {
    title: document.getElementById("jobTitle").value.trim(),
    company: document.getElementById("companyName").value.trim(),
    abn: document.getElementById("abn").value.trim(),
    category: document.getElementById("category").value,
    location: document.getElementById("location").value.trim(),
    state: document.getElementById("state").value,
    type: document.getElementById("employmentType").value,
    mode: document.getElementById("workMode").value,
    salaryText: document.getElementById("salary").value.trim(),
    visaSponsorship: document.getElementById("visaSponsorship").value,
    description: document.getElementById("description").value.trim(),
    responsibilities: document.getElementById("responsibilities").value.trim(),
    requirements: document.getElementById("requirements").value.trim(),
    benefits: document.getElementById("benefits").value.trim(),
    badge: "New",
    createdAt: serverTimestamp()
  };

  try {
    await addDoc(collection(db, "jobs"), newJob);

    postJobMessage.textContent = "Job published successfully to Firebase.";
    postJobMessage.classList.add("success");

    postJobForm.reset();
  } catch (error) {
    console.error("Error publishing job:", error);
    postJobMessage.textContent = "Error publishing job. Please check Firebase setup.";
    postJobMessage.classList.remove("success");
  }
});