import { db } from "./firebase-config.js";
import { protectPage } from "./auth-guard.js";

import {
  getAuth,
  signOut
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const auth = getAuth();

const params = new URLSearchParams(window.location.search);
const jobId = params.get("jobId");

const applicationsContainer = document.getElementById("applicationsContainer");
const noApplicants = document.getElementById("noApplicants");
const applicantsTitle = document.getElementById("applicantsTitle");

const logoutBtn = document.getElementById("logoutBtn");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", function () {
  navMenu.classList.toggle("active");
});

logoutBtn.addEventListener("click", async function (event) {
  event.preventDefault();
  await signOut(auth);
  window.location.href = "login.html";
});

protectPage("employer").then(async () => {
  if (!jobId) {
    applicantsTitle.textContent = "Invalid Job";
    return;
  }

  await loadApplicants();
});

async function loadApplicants() {
  try {
    const jobRef = doc(db, "jobs", jobId);
    const jobSnap = await getDoc(jobRef);

    if (jobSnap.exists()) {
      const job = jobSnap.data();
      applicantsTitle.textContent = `Applicants for ${job.title}`;
    }

    const applicationsQuery = query(
      collection(db, "applications"),
      where("jobId", "==", jobId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(applicationsQuery);
    const applications = [];

    querySnapshot.forEach((docSnap) => {
      applications.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });

    renderApplications(applications);
  } catch (error) {
    console.error(error);
    applicationsContainer.innerHTML = "<p>Unable to load applications.</p>";
  }
}

function renderApplications(applications) {
  applicationsContainer.innerHTML = "";

  if (applications.length === 0) {
    noApplicants.style.display = "block";
    return;
  }

  noApplicants.style.display = "none";

  applications.forEach((application) => {
    const card = document.createElement("article");
    card.className = "dashboard-job-card";

    card.innerHTML = `
      <div>
        <span class="job-badge">${application.status || "Submitted"}</span>
        <h3>${application.applicantName || "Applicant"}</h3>
        <p>${application.applicantEmail || "Email not provided"}</p>
        <p>${application.applicantPhone || "Phone not provided"}</p>
        <p>Applied for: ${application.jobTitle || "Job not specified"}</p>
        <p style="margin-top: 12px;">
          ${application.coverMessage || "No message provided."}
        </p>
      </div>

      <div class="dashboard-actions">
        <a href="${application.resumeLink}" target="_blank" class="btn btn-primary">
          View Resume
        </a>
      </div>
    `;

    applicationsContainer.appendChild(card);
  });
}