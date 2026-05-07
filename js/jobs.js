const defaultJobs = [
  {
    title: "Frontend Developer",
    company: "TechNova Solutions",
    location: "Sydney NSW",
    salary: 100000,
    salaryText: "AUD $85,000 - $100,000 + super",
    category: "IT",
    type: "Full-time",
    mode: "Remote",
    badge: "Featured",
    description: "Build modern web interfaces using HTML, CSS, JavaScript and responsive design."
  },
  {
    title: "Marketing Specialist",
    company: "BrandSpark Media",
    location: "Melbourne VIC",
    salary: 75000,
    salaryText: "AUD $60,000 - $75,000 + super",
    category: "Marketing",
    type: "Full-time",
    mode: "Hybrid",
    badge: "Urgent",
    description: "Plan campaigns, manage content, and support digital marketing growth strategies."
  },
  {
    title: "Registered Nurse",
    company: "CarePlus Hospital",
    location: "Brisbane QLD",
    salary: 90000,
    salaryText: "AUD $70,000 - $90,000 + super",
    category: "Healthcare",
    type: "Full-time",
    mode: "Onsite",
    badge: "Top Rated",
    description: "Provide patient care, coordinate with healthcare teams, and support clinical operations."
  }
];

const employerJobs = JSON.parse(localStorage.getItem("hireGeniusJobs")) || [];

const jobs = [...employerJobs, ...defaultJobs];

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

function renderJobs(jobArray) {
  jobsGrid.innerHTML = "";

  if (jobArray.length === 0) {
    jobsNoResult.style.display = "block";
    jobCount.textContent = "0 jobs found";
    return;
  }

  jobsNoResult.style.display = "none";
  jobCount.textContent = `Showing ${jobArray.length} job${jobArray.length > 1 ? "s" : ""}`;

  jobArray.forEach((job, index) => {
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

      <a href="job-details.html?id=${index}" class="btn btn-secondary">View Details</a>
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
    filtered.sort((a, b) => (b.salary || 0) - (a.salary || 0));
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

menuToggle.addEventListener("click", function () {
  navMenu.classList.toggle("active");
});

renderJobs(jobs);