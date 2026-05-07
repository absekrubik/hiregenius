const defaultJobs = [
  {
    title: "Frontend Developer",
    company: "TechNova Solutions",
    location: "Sydney NSW",
    salaryText: "AUD $85,000 - $100,000 + super",
    category: "IT",
    type: "Full-time",
    mode: "Remote",
    badge: "Featured",
    description: "Build modern web interfaces using HTML, CSS, JavaScript and responsive design.",
    responsibilities: "Develop responsive website layouts\nConvert UI designs into working pages\nImprove website performance\nWork with design and backend teams",
    requirements: "Strong HTML, CSS and JavaScript skills\nResponsive design experience\nBasic UI/UX understanding\nGit knowledge preferred",
    benefits: "Remote work options\nTraining opportunities\nCareer growth support"
  }
];

const employerJobs = JSON.parse(localStorage.getItem("hireGeniusJobs")) || [];
const jobs = [...employerJobs, ...defaultJobs];

const params = new URLSearchParams(window.location.search);
const jobId = params.get("id");
const job = jobs[jobId];

if (!job) {
  document.body.innerHTML = `
    <main style="padding: 80px; text-align: center; font-family: Inter, sans-serif;">
      <h1>Job not found</h1>
      <p>The job may have been removed or the link is invalid.</p>
      <a href="jobs.html">Back to Jobs</a>
    </main>
  `;
}

function listItems(text) {
  if (!text) return "<li>Not specified</li>";

  return text
    .split("\n")
    .filter(item => item.trim() !== "")
    .map(item => `<li>${item}</li>`)
    .join("");
}

document.getElementById("detailBadge").textContent = job.badge || "New";
document.getElementById("detailTitle").textContent = job.title;
document.getElementById("detailCompany").textContent = job.company;
document.getElementById("detailLocation").textContent = `📍 ${job.location}`;
document.getElementById("detailType").textContent = `💼 ${job.type}`;
document.getElementById("detailMode").textContent = `🌐 ${job.mode}`;
document.getElementById("detailSalary").textContent = `💰 ${job.salaryText}`;

document.getElementById("detailDescription").textContent = job.description;
document.getElementById("detailResponsibilities").innerHTML = listItems(job.responsibilities);
document.getElementById("detailRequirements").innerHTML = listItems(job.requirements);
document.getElementById("detailBenefits").innerHTML = listItems(job.benefits);

document.getElementById("overviewCompany").textContent = job.company;
document.getElementById("overviewCategory").textContent = job.category;
document.getElementById("overviewType").textContent = job.type;
document.getElementById("overviewMode").textContent = job.mode;
document.getElementById("overviewSalary").textContent = job.salaryText;
document.getElementById("overviewVisa").textContent = job.visaSponsorship || "Not specified";

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", function () {
  navMenu.classList.toggle("active");
});