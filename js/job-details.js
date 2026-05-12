import { db } from "./firebase-config.js";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

const auth = getAuth();

const params = new URLSearchParams(window.location.search);
const jobId = params.get("id");

const detailBadge = document.getElementById("detailBadge");
const detailTitle = document.getElementById("detailTitle");
const detailCompany = document.getElementById("detailCompany");
const detailLocation = document.getElementById("detailLocation");
const detailType = document.getElementById("detailType");
const detailMode = document.getElementById("detailMode");
const detailSalary = document.getElementById("detailSalary");

const detailDescription = document.getElementById("detailDescription");
const detailResponsibilities = document.getElementById("detailResponsibilities");
const detailRequirements = document.getElementById("detailRequirements");
const detailBenefits = document.getElementById("detailBenefits");

const overviewCompany = document.getElementById("overviewCompany");
const overviewCategory = document.getElementById("overviewCategory");
const overviewType = document.getElementById("overviewType");
const overviewMode = document.getElementById("overviewMode");
const overviewSalary = document.getElementById("overviewSalary");
const overviewVisa = document.getElementById("overviewVisa");

const applyNowBtn = document.getElementById("applyNowBtn");
const sidebarApplyBtn = document.getElementById("sidebarApplyBtn");
const saveJobBtn = document.getElementById("saveJobBtn");
const saveJobMessage = document.getElementById("saveJobMessage");

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

let currentUser = null;
let currentJob = null;

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", function () {
    navMenu.classList.toggle("active");
  });
}

onAuthStateChanged(auth, function (user) {
  currentUser = user;
});

if (!jobId) {
  showJobNotFound();
} else {
  loadJobDetails(jobId);
}

async function loadJobDetails(id) {
  try {
    const jobRef = doc(db, "jobs", id);
    const jobSnap = await getDoc(jobRef);

    if (!jobSnap.exists()) {
      showJobNotFound();
      return;
    }

    currentJob = {
      id: jobSnap.id,
      ...jobSnap.data()
    };

    detailBadge.textContent = currentJob.badge || "New";
    detailTitle.textContent = currentJob.title || "Untitled Job";
    detailCompany.textContent = currentJob.company || "Company not specified";
    detailLocation.textContent = `📍 ${currentJob.location || "Location not specified"}`;
    detailType.textContent = `💼 ${currentJob.type || "Type not specified"}`;
    detailMode.textContent = `🌐 ${currentJob.mode || "Mode not specified"}`;
    detailSalary.textContent = `💰 ${currentJob.salaryText || "Salary not specified"}`;

    detailDescription.textContent = currentJob.description || "Not specified.";
    detailResponsibilities.innerHTML = listItems(currentJob.responsibilities);
    detailRequirements.innerHTML = listItems(currentJob.requirements);
    detailBenefits.innerHTML = listItems(currentJob.benefits);

    overviewCompany.textContent = currentJob.company || "Not specified";
    overviewCategory.textContent = currentJob.category || "Not specified";
    overviewType.textContent = currentJob.type || "Not specified";
    overviewMode.textContent = currentJob.mode || "Not specified";
    overviewSalary.textContent = currentJob.salaryText || "Not specified";
    overviewVisa.textContent = currentJob.visaSponsorship || "Not specified";

    applyNowBtn.href = `apply.html?id=${id}`;
    sidebarApplyBtn.href = `apply.html?id=${id}`;

    document.title = `${currentJob.title} | HireGenius`;

  } catch (error) {
    console.error("Error loading job:", error);
    showJobNotFound();
  }
}

function listItems(text) {
  if (!text) return "<li>Not specified</li>";

  return text
    .split("\n")
    .filter(item => item.trim() !== "")
    .map(item => `<li>${item.trim()}</li>`)
    .join("");
}

saveJobBtn.addEventListener("click", async function () {
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  if (!currentJob) {
    saveJobMessage.textContent = "Unable to save job.";
    return;
  }

  try {
    await setDoc(
      doc(db, "savedJobs", `${currentUser.uid}_${currentJob.id}`),
      {
        userId: currentUser.uid,
        jobId: currentJob.id,
        title: currentJob.title || "",
        company: currentJob.company || "",
        location: currentJob.location || "",
        salaryText: currentJob.salaryText || "",
        savedAt: serverTimestamp()
      }
    );

    saveJobMessage.textContent = "Job saved successfully.";
    saveJobMessage.classList.add("success");

    saveJobBtn.textContent = "Saved";
  } catch (error) {
    console.error("Error saving job:", error);

    saveJobMessage.textContent = "Unable to save job.";
    saveJobMessage.classList.remove("success");
  }
});

function showJobNotFound() {
  document.body.innerHTML = `
    <main style="padding: 80px; text-align: center; font-family: Inter, sans-serif;">
      <h1>Job not found</h1>
      <p>The job may have been removed or the link is invalid.</p>
      <a href="jobs.html">Back to Jobs</a>
    </main>
  `;
}