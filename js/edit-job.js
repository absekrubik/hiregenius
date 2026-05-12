import { db } from "./firebase-config.js";
import { protectPage } from "./auth-guard.js";

import {
  getAuth,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const auth = getAuth();

const params = new URLSearchParams(window.location.search);
const jobId = params.get("id");

const editJobForm = document.getElementById("editJobForm");
const editJobMessage = document.getElementById("editJobMessage");

const logoutBtn = document.getElementById("logoutBtn");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

let currentUser = null;
let currentJob = null;

const fields = {
  title: document.getElementById("jobTitle"),
  company: document.getElementById("companyName"),
  abn: document.getElementById("abn"),
  category: document.getElementById("category"),
  location: document.getElementById("location"),
  state: document.getElementById("state"),
  type: document.getElementById("employmentType"),
  mode: document.getElementById("workMode"),
  salaryText: document.getElementById("salary"),
  visaSponsorship: document.getElementById("visaSponsorship"),
  description: document.getElementById("description"),
  responsibilities: document.getElementById("responsibilities"),
  requirements: document.getElementById("requirements"),
  benefits: document.getElementById("benefits")
};

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", function () {
    navMenu.classList.toggle("active");
  });
}

logoutBtn.addEventListener("click", async function (event) {
  event.preventDefault();
  await signOut(auth);
  window.location.href = "login.html";
});

protectPage("employer").then(async ({ user }) => {
  currentUser = user;

  if (!jobId) {
    editJobMessage.textContent = "Invalid job link.";
    editJobForm.style.display = "none";
    return;
  }

  await loadJob();
});

async function loadJob() {
  try {
    const jobRef = doc(db, "jobs", jobId);
    const jobSnap = await getDoc(jobRef);

    if (!jobSnap.exists()) {
      editJobMessage.textContent = "Job not found.";
      editJobForm.style.display = "none";
      return;
    }

    currentJob = {
      id: jobSnap.id,
      ...jobSnap.data()
    };

    if (currentJob.employerId !== currentUser.uid) {
      editJobMessage.textContent = "You are not allowed to edit this job.";
      editJobForm.style.display = "none";
      return;
    }

    fields.title.value = currentJob.title || "";
    fields.company.value = currentJob.company || "";
    fields.abn.value = currentJob.abn || "";
    fields.category.value = currentJob.category || "";
    fields.location.value = currentJob.location || "";
    fields.state.value = currentJob.state || "";
    fields.type.value = currentJob.type || "";
    fields.mode.value = currentJob.mode || "";
    fields.salaryText.value = currentJob.salaryText || "";
    fields.visaSponsorship.value = currentJob.visaSponsorship || "No";
    fields.description.value = currentJob.description || "";
    fields.responsibilities.value = currentJob.responsibilities || "";
    fields.requirements.value = currentJob.requirements || "";
    fields.benefits.value = currentJob.benefits || "";

  } catch (error) {
    console.error("Error loading job:", error);
    editJobMessage.textContent = "Unable to load job.";
    editJobForm.style.display = "none";
  }
}

editJobForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (!currentUser || !currentJob) {
    editJobMessage.textContent = "Unable to update job.";
    return;
  }

  const updatedJob = {
    title: fields.title.value.trim(),
    company: fields.company.value.trim(),
    abn: fields.abn.value.trim(),
    category: fields.category.value,
    location: fields.location.value.trim(),
    state: fields.state.value,
    type: fields.type.value,
    mode: fields.mode.value,
    salaryText: fields.salaryText.value.trim(),
    visaSponsorship: fields.visaSponsorship.value,
    description: fields.description.value.trim(),
    responsibilities: fields.responsibilities.value.trim(),
    requirements: fields.requirements.value.trim(),
    benefits: fields.benefits.value.trim(),
    updatedAt: serverTimestamp()
  };

  try {
    await updateDoc(doc(db, "jobs", jobId), updatedJob);

    editJobMessage.textContent = "Job updated successfully.";
    editJobMessage.classList.add("success");

    setTimeout(() => {
      window.location.href = "employer-dashboard.html";
    }, 1200);

  } catch (error) {
    console.error("Error updating job:", error);

    editJobMessage.textContent = "Unable to update job.";
    editJobMessage.classList.remove("success");
  }
});