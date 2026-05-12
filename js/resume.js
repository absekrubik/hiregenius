import { db } from "./firebase-config.js";
import { protectPage } from "./auth-guard.js";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const resumeForm = document.getElementById("resumeForm");
const resumeMessage = document.getElementById("resumeMessage");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const printResumeBtn = document.getElementById("printResumeBtn");
const templateSelect = document.getElementById("templateSelect");
const resumePreview = document.getElementById("resumePreview");

const fields = {
  name: document.getElementById("resumeName"),
  email: document.getElementById("resumeEmail"),
  phone: document.getElementById("resumePhone"),
  location: document.getElementById("resumeLocation"),
  summary: document.getElementById("resumeSummary"),
  experience: document.getElementById("resumeExperience"),
  education: document.getElementById("resumeEducation"),
  skills: document.getElementById("resumeSkills"),
  link: document.getElementById("resumeLinkInput")
};

const preview = {
  name: document.getElementById("previewName"),
  contact: document.getElementById("previewContact"),
  summary: document.getElementById("previewSummary"),
  experience: document.getElementById("previewExperience"),
  education: document.getElementById("previewEducation"),
  skills: document.getElementById("previewSkills")
};

let currentUser = null;

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", function () {
    navMenu.classList.toggle("active");
  });
}

Object.values(fields).forEach((field) => {
  if (field) {
    field.addEventListener("input", updatePreview);
  }
});

if (templateSelect) {
  templateSelect.addEventListener("change", function () {
    updateTemplate();
    updatePreview();
  });
}

updatePreview();
updateTemplate();

protectPage("jobseeker").then(async ({ user, userData }) => {
  currentUser = user;

  fields.name.value = userData.fullName || "";
  fields.email.value = user.email || "";

  await loadResume(user.uid);

  updateTemplate();
  updatePreview();
});

resumeForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (!currentUser) {
    resumeMessage.textContent = "Please sign in first.";
    return;
  }

  const resumeData = {
    userId: currentUser.uid,
    template: templateSelect.value,
    name: fields.name.value.trim(),
    email: fields.email.value.trim(),
    phone: fields.phone.value.trim(),
    location: fields.location.value.trim(),
    summary: fields.summary.value.trim(),
    experience: fields.experience.value.trim(),
    education: fields.education.value.trim(),
    skills: fields.skills.value.trim(),
    resumeLink: fields.link.value.trim(),
    updatedAt: serverTimestamp()
  };

  try {
    await setDoc(doc(db, "resumes", currentUser.uid), resumeData);

    resumeMessage.textContent = "Resume saved successfully.";
    resumeMessage.classList.add("success");
  } catch (error) {
    console.error(error);
    resumeMessage.textContent = "Unable to save resume.";
    resumeMessage.classList.remove("success");
  }
});

async function loadResume(userId) {
  try {
    const resumeRef = doc(db, "resumes", userId);
    const resumeSnap = await getDoc(resumeRef);

    if (!resumeSnap.exists()) return;

    const data = resumeSnap.data();

    templateSelect.value = data.template || "modern";
    fields.name.value = data.name || fields.name.value;
    fields.email.value = data.email || fields.email.value;
    fields.phone.value = data.phone || "";
    fields.location.value = data.location || "";
    fields.summary.value = data.summary || "";
    fields.experience.value = data.experience || "";
    fields.education.value = data.education || "";
    fields.skills.value = data.skills || "";
    fields.link.value = data.resumeLink || "";
  } catch (error) {
    console.error("Unable to load resume:", error);
  }
}

function updateTemplate() {
  if (!resumePreview || !templateSelect) return;

  resumePreview.className = "resume-preview";
  resumePreview.classList.add(`template-${templateSelect.value}`);
}

function updatePreview() {
  preview.name.textContent = fields.name.value || "Your Name";

  preview.contact.textContent =
    `${fields.email.value || "Email"} • ${fields.phone.value || "Phone"} • ${fields.location.value || "Location"}`;

  preview.summary.textContent =
    fields.summary.value || "Your professional summary will appear here.";

  preview.experience.innerHTML =
    formatMultiline(fields.experience.value) || "Your work experience will appear here.";

  preview.education.innerHTML =
    formatMultiline(fields.education.value) || "Your education will appear here.";

  preview.skills.textContent =
    fields.skills.value || "Your skills will appear here.";
}

function formatMultiline(text) {
  if (!text || !text.trim()) return "";

  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "")
    .join("<br>");
}

if (printResumeBtn) {
  printResumeBtn.addEventListener("click", function () {
    window.print();
  });
}