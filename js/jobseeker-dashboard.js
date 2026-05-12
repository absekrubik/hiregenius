import { db } from "./firebase-config.js";
import { protectPage } from "./auth-guard.js";

import {
  getAuth,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  collection,
  query,
  where,
  getDocs,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const auth = getAuth();

const jobseekerApplications = document.getElementById("jobseekerApplications");
const jobseekerNoApplications = document.getElementById("jobseekerNoApplications");
const jobseekerCount = document.getElementById("jobseekerCount");
const applicationsCount = document.getElementById("applicationsCount");

const savedJobsContainer = document.getElementById("savedJobsContainer");
const noSavedJobs = document.getElementById("noSavedJobs");
const savedJobsCount = document.getElementById("savedJobsCount");
const savedJobsSummaryCount = document.getElementById("savedJobsSummaryCount");

const logoutBtn = document.getElementById("logoutBtn");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

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

protectPage("jobseeker").then(async ({ user }) => {
  await loadMyApplications(user.uid);
  await loadSavedJobs(user.uid);
});

async function loadMyApplications(userId) {
  jobseekerApplications.innerHTML = "<p>Loading your applications...</p>";

  try {
    const applicationsQuery = query(
      collection(db, "applications"),
      where("applicantId", "==", userId),
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
    console.error("Error loading applications:", error);

    jobseekerApplications.innerHTML = `
      <p>Unable to load your applications. Please check Firebase index settings.</p>
    `;
  }
}

function renderApplications(applications) {
  jobseekerApplications.innerHTML = "";

  if (applications.length === 0) {
    jobseekerNoApplications.style.display = "block";
    jobseekerCount.textContent = "0 applications submitted";
    applicationsCount.textContent = "0";
    return;
  }

  jobseekerNoApplications.style.display = "none";

  jobseekerCount.textContent =
    `${applications.length} application${applications.length > 1 ? "s" : ""} submitted`;

  applicationsCount.textContent = applications.length;

  applications.forEach((application) => {
    const card = document.createElement("article");
    card.className = "dashboard-job-card";

    card.innerHTML = `
      <div>
        <span class="job-badge">${application.status || "Submitted"}</span>

        <h3>${application.jobTitle || "Job title not available"}</h3>

        <p>${application.company || "Company not available"}</p>

        <p>Applicant: ${application.applicantName || "Not specified"}</p>

        <p>Email: ${application.applicantEmail || "Not specified"}</p>
      </div>

      <div class="dashboard-actions">
        <a href="job-details.html?id=${application.jobId}" class="btn btn-secondary">
          View Job
        </a>

        <a href="${application.resumeLink}" target="_blank" class="btn btn-primary">
          View Resume
        </a>
      </div>
    `;

    jobseekerApplications.appendChild(card);
  });
}

async function loadSavedJobs(userId) {
  savedJobsContainer.innerHTML = "<p>Loading saved jobs...</p>";

  try {
    const savedQuery = query(
      collection(db, "savedJobs"),
      where("userId", "==", userId),
      orderBy("savedAt", "desc")
    );

    const querySnapshot = await getDocs(savedQuery);

    const savedJobs = [];

    querySnapshot.forEach((docSnap) => {
      savedJobs.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });

    renderSavedJobs(savedJobs);

  } catch (error) {
    console.error("Error loading saved jobs:", error);

    savedJobsContainer.innerHTML =
      "<p>Unable to load saved jobs. Please check Firebase index settings.</p>";
  }
}

function renderSavedJobs(savedJobs) {
  savedJobsContainer.innerHTML = "";

  if (savedJobs.length === 0) {
    noSavedJobs.style.display = "block";
    savedJobsCount.textContent = "0 saved jobs";
    savedJobsSummaryCount.textContent = "0";
    return;
  }

  noSavedJobs.style.display = "none";

  savedJobsCount.textContent =
    `${savedJobs.length} saved job${savedJobs.length > 1 ? "s" : ""}`;

  savedJobsSummaryCount.textContent = savedJobs.length;

  savedJobs.forEach((job) => {
    const card = document.createElement("article");
    card.className = "dashboard-job-card";

    card.innerHTML = `
      <div>
        <span class="job-badge">Saved</span>

        <h3>${job.title || "Job Title"}</h3>

        <p>${job.company || "Company"}</p>

        <p>${job.location || "Location"}</p>

        <p>${job.salaryText || "Salary not specified"}</p>
      </div>

      <div class="dashboard-actions">
        <a href="job-details.html?id=${job.jobId}" class="btn btn-primary">
          View Job
        </a>
      </div>
    `;

    savedJobsContainer.appendChild(card);
  });
}