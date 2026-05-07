const postJobForm = document.getElementById("postJobForm");
const postJobMessage = document.getElementById("postJobMessage");

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", function () {
  navMenu.classList.toggle("active");
});

postJobForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const newJob = {
    title: document.getElementById("jobTitle").value,
    company: document.getElementById("companyName").value,
    abn: document.getElementById("abn").value,
    category: document.getElementById("category").value,
    location: document.getElementById("location").value,
    state: document.getElementById("state").value,
    type: document.getElementById("employmentType").value,
    mode: document.getElementById("workMode").value,
    salaryText: document.getElementById("salary").value,
    visaSponsorship: document.getElementById("visaSponsorship").value,
    description: document.getElementById("description").value,
    responsibilities: document.getElementById("responsibilities").value,
    requirements: document.getElementById("requirements").value,
    benefits: document.getElementById("benefits").value,
    badge: "New",
    createdAt: new Date().toISOString()
  };

  let savedJobs = JSON.parse(localStorage.getItem("hireGeniusJobs")) || [];

  savedJobs.push(newJob);

  localStorage.setItem("hireGeniusJobs", JSON.stringify(savedJobs));

  postJobMessage.textContent = "Job published successfully. It is now saved in your browser.";
  postJobMessage.classList.add("success");

  postJobForm.reset();
});