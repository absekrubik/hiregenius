const jobs = [
  {
    title: "Frontend Developer",
    company: "TechNova Solutions",
    location: "New York, USA",
    salary: "$85,000 - $100,000",
    category: "IT",
    type: "Remote",
    badge: "Featured"
  },
  {
    title: "Marketing Specialist",
    company: "BrandSpark Media",
    location: "Los Angeles, USA",
    salary: "$60,000 - $75,000",
    category: "Marketing",
    type: "Hybrid",
    badge: "Urgent"
  },
  {
    title: "Registered Nurse",
    company: "CarePlus Hospital",
    location: "Chicago, USA",
    salary: "$70,000 - $90,000",
    category: "Healthcare",
    type: "Full-time",
    badge: "Top Rated"
  },
  {
    title: "Accountant",
    company: "FinEdge Group",
    location: "Dallas, USA",
    salary: "$65,000 - $82,000",
    category: "Accounting",
    type: "Full-time",
    badge: "New"
  },
  {
    title: "Chef",
    company: "Urban Table Restaurant",
    location: "Miami, USA",
    salary: "$55,000 - $70,000",
    category: "Hospitality",
    type: "Full-time",
    badge: "Hiring Now"
  },
  {
    title: "Software Engineer",
    company: "CloudCore Labs",
    location: "Remote",
    salary: "$95,000 - $120,000",
    category: "IT",
    type: "Remote",
    badge: "Premium"
  }
];

const jobList = document.getElementById("jobList");
const noJobs = document.getElementById("noJobs");
const searchForm = document.getElementById("searchForm");
const keywordInput = document.getElementById("keywordInput");
const locationInput = document.getElementById("locationInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const categoryCards = document.querySelectorAll(".category-card");

let selectedCategory = "All";

function displayJobs(filteredJobs) {
  jobList.innerHTML = "";

  if (filteredJobs.length === 0) {
    noJobs.style.display = "block";
    return;
  }

  noJobs.style.display = "none";

  filteredJobs.forEach((job) => {

    const jobCard = document.createElement("article");

    jobCard.className = "job-card reveal active";

    jobCard.innerHTML = `
      <div class="job-badge">${job.badge}</div>

      <h3>${job.title}</h3>

      <p class="company">${job.company}</p>

      <p class="location">${job.location}</p>

      <p class="salary">${job.salary}</p>

      <div class="job-tags">
        <span>${job.category}</span>
        <span>${job.type}</span>
      </div>

      <button class="btn btn-secondary">Apply Now</button>
    `;

    jobList.appendChild(jobCard);
  });
}

function filterJobs() {

  const keyword = keywordInput.value.toLowerCase().trim();

  const location = locationInput.value.toLowerCase().trim();

  const filteredJobs = jobs.filter((job) => {

    const matchesKeyword =
      job.title.toLowerCase().includes(keyword) ||
      job.company.toLowerCase().includes(keyword) ||
      job.category.toLowerCase().includes(keyword);

    const matchesLocation =
      job.location.toLowerCase().includes(location);

    const matchesCategory =
      selectedCategory === "All" ||
      job.category === selectedCategory;

    return matchesKeyword &&
           matchesLocation &&
           matchesCategory;
  });

  displayJobs(filteredJobs);
}

searchForm.addEventListener("submit", function (event) {

  event.preventDefault();

  filterJobs();

  document.getElementById("jobs").scrollIntoView({
    behavior: "smooth"
  });
});

filterButtons.forEach((button) => {

  button.addEventListener("click", function () {

    filterButtons.forEach((btn) =>
      btn.classList.remove("active")
    );

    this.classList.add("active");

    selectedCategory = this.dataset.category;

    filterJobs();
  });
});

/* category cards */

categoryCards.forEach((card) => {

  card.addEventListener("click", () => {

    selectedCategory = card.dataset.category;

    filterButtons.forEach((btn) => {

      btn.classList.remove("active");

      if (btn.dataset.category === selectedCategory) {
        btn.classList.add("active");
      }
    });

    filterJobs();

    document.getElementById("jobs").scrollIntoView({
      behavior: "smooth"
    });
  });
});

/* reveal animation */

const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {

  entries.forEach((entry) => {

    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });

}, {
  threshold: 0.15
});

reveals.forEach((item) =>
  observer.observe(item)
);

/* mobile menu */

const menuToggle = document.getElementById("menuToggle");

const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

/* animated counters */

const counters = document.querySelectorAll(".counter");

counters.forEach((counter) => {

  counter.innerText = "0";

  const updateCounter = () => {

    const target = +counter.getAttribute("data-target");

    const current = +counter.innerText;

    const increment = target / 100;

    if (current < target) {

      counter.innerText = `${Math.ceil(current + increment)}`;

      setTimeout(updateCounter, 20);

    } else {

      counter.innerText = target;
    }
  };

  updateCounter();
});

displayJobs(jobs);