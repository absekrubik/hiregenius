import { db } from "./firebase-config.js";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

const auth = getAuth();

const resumeForm = document.getElementById("resumeForm");
const resumeMessage = document.getElementById("resumeMessage");

const templateSelect = document.getElementById("templateSelect");
const resumePreview = document.getElementById("resumePreview");

const printResumeBtn = document.getElementById("printResumeBtn");

const fields = {
  name: document.getElementById("resumeName"),
  email: document.getElementById("resumeEmail"),
  phone: document.getElementById("resumePhone"),
  location: document.getElementById("resumeLocation"),
  summary: document.getElementById("resumeSummary"),
  experience: document.getElementById("resumeExperience"),
  education: document.getElementById("resumeEducation"),
  skills: document.getElementById("resumeSkills")
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

/* =========================
   LIVE PREVIEW
========================= */

Object.values(fields).forEach((field) => {

  if (field) {

    field.addEventListener("input", updatePreview);

  }
});

templateSelect.addEventListener("change", function () {

  updateTemplate();

});

function updatePreview() {

  preview.name.textContent =
    fields.name.value || "Your Name";

  preview.contact.textContent =
    `${fields.email.value || "Email"} • ${fields.phone.value || "Phone"} • ${fields.location.value || "Location"}`;

  preview.summary.textContent =
    fields.summary.value || "Professional summary appears here.";

  preview.experience.innerHTML =
    formatText(fields.experience.value) || "Experience appears here.";

  preview.education.innerHTML =
    formatText(fields.education.value) || "Education appears here.";

  preview.skills.textContent =
    fields.skills.value || "Skills appear here.";
}

function updateTemplate() {

  resumePreview.className = "resume-preview";

  resumePreview.classList.add(
    `template-${templateSelect.value}`
  );
}

function formatText(text) {

  if (!text) return "";

  return text
    .split("\n")
    .filter(line => line.trim() !== "")
    .join("<br>");
}

/* =========================
   AUTH
========================= */

onAuthStateChanged(auth, async function(user) {

  if (!user) return;

  currentUser = user;

  fields.email.value = user.email;

  await loadResume(user.uid);

  updatePreview();

  updateTemplate();
});

/* =========================
   LOAD RESUME
========================= */

async function loadResume(userId) {

  try {

    const resumeRef =
      doc(db, "resumes", userId);

    const resumeSnap =
      await getDoc(resumeRef);

    if (!resumeSnap.exists()) return;

    const data = resumeSnap.data();

    templateSelect.value =
      data.template || "modern";

    fields.name.value =
      data.name || "";

    fields.email.value =
      data.email || "";

    fields.phone.value =
      data.phone || "";

    fields.location.value =
      data.location || "";

    fields.summary.value =
      data.summary || "";

    fields.experience.value =
      data.experience || "";

    fields.education.value =
      data.education || "";

    fields.skills.value =
      data.skills || "";

  } catch(error) {

    console.error(error);
  }
}

/* =========================
   SAVE RESUME
========================= */

resumeForm.addEventListener("submit", async function(event) {

  event.preventDefault();

  if (!currentUser) {

    resumeMessage.textContent =
      "Please login first.";

    return;
  }

  try {

    await setDoc(
      doc(db, "resumes", currentUser.uid),
      {
        template: templateSelect.value,

        name: fields.name.value,
        email: fields.email.value,
        phone: fields.phone.value,
        location: fields.location.value,

        summary: fields.summary.value,
        experience: fields.experience.value,
        education: fields.education.value,
        skills: fields.skills.value,

        updatedAt: serverTimestamp()
      }
    );

    resumeMessage.textContent =
      "Resume saved successfully.";

    resumeMessage.classList.add("success");

  } catch(error) {

    console.error(error);

    resumeMessage.textContent =
      "Unable to save resume.";
  }
});

/* =========================
   PRINT PDF
========================= */

printResumeBtn.addEventListener("click", function() {

  window.print();

});

/* =========================
   INITIAL
========================= */

updatePreview();

updateTemplate();