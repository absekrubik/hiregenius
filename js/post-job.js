import { db } from "./firebase-config.js";
import { protectPage } from "./auth-guard.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

let currentUser = null;

const postJobForm = document.getElementById("postJobForm");
const postJobMessage = document.getElementById("postJobMessage");

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", function () {
  navMenu.classList.toggle("active");
});

protectPage("employer").then(({ user }) => {
  currentUser = user;
});

postJobForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (!currentUser) {
    postJobMessage.textContent = "Please sign in as an employer before posting a job.";
    return;
  }

  const newJob = {
    employerId: currentUser.uid,
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

    postJobMessage.textContent = "Job published successfully.";
    postJobMessage.classList.add("success");

    postJobForm.reset();
  } catch (error) {
    console.error(error);
    postJobMessage.textContent = "Error publishing job.";
    postJobMessage.classList.remove("success");
  }
});