import { db } from "./firebase-config.js";

import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

let jobs = [];

const jobsGrid = document.getElementById("jobsGrid");
const jobsNoResult = document.getElementById("jobsNoResult");
const jobCount = document.getElementById("jobCount");

const jobsSearchForm = document.getElementById("jobsSearchForm");
const jobsKeyword = document.getElementById("jobsKeyword");
const jobsLocation = document.getElementById("jobsLocation");

const categoryFilter = document.getElementById("categoryFilter");
const typeFilter = document.getElementById("typeFilter");
const modeFilter = document.getElementById("modeFilter");
const sortFilter = document.getElementById("sortFilter");
const clearFilters = document.getElementById("clearFilters");

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", function () {
  navMenu.classList.toggle("active");
});

async function loadJobsFromFirebase() {
  jobsGrid.innerHTML = "<p>Loading jobs...</p>";

  try {
    const jobsQuery = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(jobsQuery);

    jobs = [];

    querySnapshot.forEach((doc) => {
      jobs.push({
        id: doc.id,
        ...doc.data()
      });
    });

    renderJobs(jobs);
  } catch (error) {
    console.error("Error loading jobs:", error);
    jobsGrid.innerHTML = "<p>Unable to load jobs. Please check Firebase setup.</p>";
  }
}

function renderJobs(jobArray) {
  jobsGrid.innerHTML = "";

  if (jobArray.length === 0) {
    jobsNoResult.style.display = "block";
    jobCount.textContent = "0 jobs found";
    return;
  }

  jobsNoResult.style.display = "none";
  jobCount.textContent = `Showing ${jobArray.length} job${jobArray.length > 1 ? "s" : ""}`;

  jobArray.forEach((job) => {
    const card = document.createElement("article");
    card.className = "job-card";

    card.innerHTML = `
      <div class="job-badge">${job.badge || "New"}</div>
      <h3>${job.title}</h3>
      <p class="company">${job.company}</p>
      <p class="location">${job.location}</p>
      <p class="salary">${job.salaryText}</p>
      <p class="job-description">${job.description}</p>

      <div class="job-tags">
        <span>${job.category}</span>
        <span>${job.type}</span>
        <span>${job.mode}</span>
      </div>

      <a href="job-details.html?id=${job.id}" class="btn btn-secondary">View Details</a>
    `;

    jobsGrid.appendChild(card);
  });
}

function filterJobs() {
  const keyword = jobsKeyword.value.toLowerCase().trim();
  const location = jobsLocation.value.toLowerCase().trim();
  const category = categoryFilter.value;
  const type = typeFilter.value;
  const mode = modeFilter.value;
  const sort = sortFilter.value;

  let filtered = jobs.filter((job) => {
    const keywordMatch =
      job.title.toLowerCase().includes(keyword) ||
      job.company.toLowerCase().includes(keyword) ||
      job.category.toLowerCase().includes(keyword);

    const locationMatch =
      job.location.toLowerCase().includes(location) ||
      job.mode.toLowerCase().includes(location);

    const categoryMatch =
      category === "All" || job.category === category;

    const typeMatch =
      type === "All" || job.type === type || job.mode === type;

    const modeMatch =
      mode === "All" || job.mode === mode;

    return keywordMatch && locationMatch && categoryMatch && typeMatch && modeMatch;
  });

  if (sort === "salary") {
    filtered.sort((a, b) => extractSalary(b.salaryText) - extractSalary(a.salaryText));
  }

  if (sort === "remote") {
    filtered.sort((a, b) => {
      if (a.mode === "Remote" && b.mode !== "Remote") return -1;
      if (a.mode !== "Remote" && b.mode === "Remote") return 1;
      return 0;
    });
  }

  renderJobs(filtered);
}

function extractSalary(salaryText) {
  if (!salaryText) return 0;

  const numbers = salaryText.match(/\d[\d,]*/g);

  if (!numbers) return 0;

  return Math.max(...numbers.map(num => Number(num.replace(/,/g, ""))));
}

jobsSearchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  filterJobs();
});

categoryFilter.addEventListener("change", filterJobs);
typeFilter.addEventListener("change", filterJobs);
modeFilter.addEventListener("change", filterJobs);
sortFilter.addEventListener("change", filterJobs);

clearFilters.addEventListener("click", function () {
  jobsKeyword.value = "";
  jobsLocation.value = "";
  categoryFilter.value = "All";
  typeFilter.value = "All";
  modeFilter.value = "All";
  sortFilter.value = "default";
  renderJobs(jobs);
});

loadJobsFromFirebase();