import { db } from "./firebase-config.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const jobId = params.get("id");

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", function () {
  navMenu.classList.toggle("active");
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

    const job = jobSnap.data();

    document.getElementById("detailBadge").textContent = job.badge || "New";
    document.getElementById("detailTitle").textContent = job.title;
    document.getElementById("detailCompany").textContent = job.company;
    document.getElementById("detailLocation").textContent = `📍 ${job.location}`;
    document.getElementById("detailType").textContent = `💼 ${job.type}`;
    document.getElementById("detailMode").textContent = `🌐 ${job.mode}`;
    document.getElementById("detailSalary").textContent = `💰 ${job.salaryText}`;

    document.getElementById("detailDescription").textContent = job.description || "Not specified";
    document.getElementById("detailResponsibilities").innerHTML = listItems(job.responsibilities);
    document.getElementById("detailRequirements").innerHTML = listItems(job.requirements);
    document.getElementById("detailBenefits").innerHTML = listItems(job.benefits);

    document.getElementById("overviewCompany").textContent = job.company;
    document.getElementById("overviewCategory").textContent = job.category;
    document.getElementById("overviewType").textContent = job.type;
    document.getElementById("overviewMode").textContent = job.mode;
    document.getElementById("overviewSalary").textContent = job.salaryText;
    document.getElementById("overviewVisa").textContent = job.visaSponsorship || "Not specified";

    document.title = `${job.title} | HireGenius Australia`;
  } catch (error) {
    console.error("Error loading job details:", error);
    showJobNotFound();
  }
}

function listItems(text) {
  if (!text) return "<li>Not specified</li>";

  return text
    .split("\n")
    .filter(item => item.trim() !== "")
    .map(item => `<li>${item}</li>`)
    .join("");
}

function showJobNotFound() {
  document.body.innerHTML = `
    <main style="padding: 80px; text-align: center; font-family: Inter, sans-serif;">
      <h1>Job not found</h1>
      <p>The job may have been removed or the link is invalid.</p>
      <a href="jobs.html">Back to Jobs</a>
    </main>
  `;
}