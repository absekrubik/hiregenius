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
  deleteDoc,
  doc,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const auth = getAuth();

const dashboardJobs = document.getElementById("dashboardJobs");
const dashboardNoJobs = document.getElementById("dashboardNoJobs");
const dashboardCount = document.getElementById("dashboardCount");

const logoutBtn = document.getElementById("logoutBtn");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

let currentUser = null;

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

  await loadEmployerJobs(user.uid);
});

async function loadEmployerJobs(employerId) {
  dashboardJobs.innerHTML = "<p>Loading your jobs...</p>";

  try {
    const jobsQuery = query(
      collection(db, "jobs"),
      where("employerId", "==", employerId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(jobsQuery);

    const jobs = [];

    querySnapshot.forEach((docSnap) => {
      jobs.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });

    renderDashboardJobs(jobs);

  } catch (error) {
    console.error("Error loading employer jobs:", error);

    dashboardJobs.innerHTML = `
      <p>
        Unable to load your jobs. Please check Firebase rules or index settings.
      </p>
    `;
  }
}

function renderDashboardJobs(jobs) {
  dashboardJobs.innerHTML = "";

  if (jobs.length === 0) {
    dashboardNoJobs.style.display = "block";
    dashboardCount.textContent = "0 jobs posted";
    return;
  }

  dashboardNoJobs.style.display = "none";

  dashboardCount.textContent =
    `${jobs.length} job${jobs.length > 1 ? "s" : ""} posted`;

  jobs.forEach((job) => {
    const card = document.createElement("article");

    card.className = "dashboard-job-card";

    card.innerHTML = `
      <div>
        <span class="job-badge">
          ${job.badge || "New"}
        </span>

        <h3>
          ${job.title || "Untitled Job"}
        </h3>

        <p>
          ${job.company || "Company not specified"}
        </p>

        <p>
          ${job.location || "Location not specified"}
          • ${job.type || "Type not specified"}
          • ${job.mode || "Mode not specified"}
        </p>

        <p>
          ${job.salaryText || "Salary not specified"}
        </p>
      </div>

      <div class="dashboard-actions">

        <a href="job-details.html?id=${job.id}" class="btn btn-secondary">
          View
        </a>

        <a href="edit-job.html?id=${job.id}" class="btn btn-secondary">
          Edit
        </a>

        <a href="applicants.html?jobId=${job.id}" class="btn btn-primary">
          View Applicants
        </a>

        <button class="btn delete-btn" data-id="${job.id}">
          Delete
        </button>

      </div>
    `;

    dashboardJobs.appendChild(card);
  });

  attachDeleteEvents();
}

function attachDeleteEvents() {
  const deleteButtons = document.querySelectorAll(".delete-btn");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      const jobId = this.dataset.id;

      const confirmDelete = confirm(
        "Are you sure you want to delete this job?"
      );

      if (!confirmDelete) return;

      try {
        await deleteDoc(doc(db, "jobs", jobId));

        if (currentUser) {
          await loadEmployerJobs(currentUser.uid);
        }

      } catch (error) {
        console.error("Error deleting job:", error);

        alert("Unable to delete this job.");
      }
    });
  });
}