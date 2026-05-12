import { db } from "./firebase-config.js";
import { protectPage } from "./auth-guard.js";

import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const jobId = params.get("id");

const applyForm = document.getElementById("applyForm");
const applyMessage = document.getElementById("applyMessage");
const applyJobTitle = document.getElementById("applyJobTitle");

const applicantName = document.getElementById("applicantName");
const applicantEmail = document.getElementById("applicantEmail");

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

let currentJob = null;
let currentUser = null;
let currentUserData = null;

menuToggle.addEventListener("click", function () {
  navMenu.classList.toggle("active");
});

if (!jobId) {
  applyJobTitle.textContent = "Invalid job link.";
  applyForm.style.display = "none";
}

protectPage("jobseeker").then(async ({ user, userData }) => {
  currentUser = user;
  currentUserData = userData;

  applicantEmail.value = user.email || "";
  applicantName.value = userData.fullName || "";

  await loadJob();
});

async function loadJob() {
  try {
    const jobRef = doc(db, "jobs", jobId);
    const jobSnap = await getDoc(jobRef);

    if (!jobSnap.exists()) {
      applyJobTitle.textContent = "Job not found.";
      applyForm.style.display = "none";
      return;
    }

    currentJob = {
      id: jobSnap.id,
      ...jobSnap.data()
    };

    applyJobTitle.textContent =
      `Applying for: ${currentJob.title} at ${currentJob.company}`;
  } catch (error) {
    console.error(error);
    applyJobTitle.textContent = "Unable to load job.";
    applyForm.style.display = "none";
  }
}

applyForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (!currentUser || !currentJob) {
    applyMessage.textContent = "Unable to submit application.";
    return;
  }

  const application = {
    jobId: currentJob.id,
    employerId: currentJob.employerId || "",
    jobTitle: currentJob.title,
    company: currentJob.company,

    applicantId: currentUser.uid,
    applicantName: applicantName.value.trim(),
    applicantEmail: applicantEmail.value.trim(),
    applicantPhone: document.getElementById("applicantPhone").value.trim(),
    resumeLink: document.getElementById("resumeLink").value.trim(),
    coverMessage: document.getElementById("coverMessage").value.trim(),

    status: "Submitted",
    createdAt: serverTimestamp()
  };

  try {
    await addDoc(collection(db, "applications"), application);

    applyMessage.textContent = "Application submitted successfully.";
    applyMessage.classList.add("success");

    applyForm.reset();
    applicantEmail.value = currentUser.email || "";
    applicantName.value = currentUserData.fullName || "";
  } catch (error) {
    console.error(error);
    applyMessage.textContent = "Unable to submit application.";
    applyMessage.classList.remove("success");
  }
});