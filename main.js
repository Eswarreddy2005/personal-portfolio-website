// Base URL of the API. Same-origin by default since Express serves
// the frontend too. Change this if you deploy frontend & backend separately.
const API_BASE = window.location.origin + "/api";

document.getElementById("year").textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => navLinks.classList.remove("open"))
);

// ---------- Skills ----------
async function loadSkills() {
  const container = document.getElementById("skillsContainer");
  try {
    const res = await fetch(`${API_BASE}/skills`);
    if (!res.ok) throw new Error("Failed to load skills");
    const grouped = await res.json();
    const categories = Object.keys(grouped);

    if (categories.length === 0) {
      container.innerHTML = `<p class="empty-text">No skills added yet.</p>`;
      return;
    }

    container.innerHTML = categories
      .map((category) => {
        const items = grouped[category]
          .map(
            (skill) => `
            <div class="skill-item">
              <div class="skill-item-top">
                <span>${escapeHtml(skill.name)}</span>
                <span>${skill.level}%</span>
              </div>
              <div class="skill-bar-track">
                <div class="skill-bar-fill" style="width:${skill.level}%"></div>
              </div>
            </div>`
          )
          .join("");
        return `
          <div class="skill-category">
            <h3>${escapeHtml(category)}</h3>
            ${items}
          </div>`;
      })
      .join("");
  } catch (err) {
    container.innerHTML = `<p class="empty-text">Could not load skills. Is the backend running?</p>`;
    console.error(err);
  }
}

// ---------- Projects ----------
async function loadProjects() {
  const container = document.getElementById("projectsContainer");
  try {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error("Failed to load projects");
    const projects = await res.json();

    if (projects.length === 0) {
      container.innerHTML = `<p class="empty-text">No projects added yet. Use the API to add some!</p>`;
      return;
    }

    container.innerHTML = projects
      .map(
        (p) => `
        <div class="project-card">
          <div class="project-thumb">${escapeHtml(p.title)}</div>
          <div class="project-body">
            <h3>${escapeHtml(p.title)}</h3>
            <p>${escapeHtml(p.description)}</p>
            <div class="tech-tags">
              ${p.tech_stack.map((t) => `<span class="tech-tag">${escapeHtml(t)}</span>`).join("")}
            </div>
            <div class="project-links">
              ${p.github_url ? `<a href="${p.github_url}" target="_blank" rel="noopener">GitHub →</a>` : ""}
              ${p.live_url ? `<a href="${p.live_url}" target="_blank" rel="noopener">Live Demo →</a>` : ""}
            </div>
          </div>
        </div>`
      )
      .join("");
  } catch (err) {
    container.innerHTML = `<p class="empty-text">Could not load projects. Is the backend running?</p>`;
    console.error(err);
  }
}

// ---------- Contact form ----------
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const submitBtn = document.getElementById("submitBtn");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending…";
  formStatus.textContent = "";
  formStatus.className = "form-status";

  try {
    const res = await fetch(`${API_BASE}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message })
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Something went wrong");
    }

    formStatus.textContent = "Message sent! I'll get back to you soon.";
    formStatus.classList.add("success");
    contactForm.reset();
  } catch (err) {
    formStatus.textContent = `Error: ${err.message}`;
    formStatus.classList.add("error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send Message";
  }
});

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

loadSkills();
loadProjects();
