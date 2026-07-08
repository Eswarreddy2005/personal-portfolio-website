// seed.js — run with `npm run seed` to populate sample data
const db = require("./db");

const projectCount = db.prepare("SELECT COUNT(*) AS c FROM projects").get().c;
const skillCount = db.prepare("SELECT COUNT(*) AS c FROM skills").get().c;

if (projectCount === 0) {
  const insertProject = db.prepare(`
    INSERT INTO projects (title, description, tech_stack, image_url, github_url, live_url, featured)
    VALUES (@title, @description, @tech_stack, @image_url, @github_url, @live_url, @featured)
  `);

  const projects = [
    {
      title: "E-Commerce Dashboard",
      description: "An admin dashboard for managing products, orders, and customers with real-time charts.",
      tech_stack: "React,Node.js,Express,PostgreSQL",
      image_url: "assets/project-placeholder-1.svg",
      github_url: "https://github.com/yourusername/ecommerce-dashboard",
      live_url: "",
      featured: 1
    },
    {
      title: "Task Manager App",
      description: "A drag-and-drop kanban board for organizing tasks across projects and teams.",
      tech_stack: "React,Redux,Node.js,MongoDB",
      image_url: "assets/project-placeholder-2.svg",
      github_url: "https://github.com/yourusername/task-manager",
      live_url: "",
      featured: 1
    },
    {
      title: "Weather Forecast App",
      description: "A responsive weather app using a public API with 5-day forecasts and geolocation.",
      tech_stack: "JavaScript,HTML,CSS,REST API",
      image_url: "assets/project-placeholder-3.svg",
      github_url: "https://github.com/yourusername/weather-app",
      live_url: "",
      featured: 0
    }
  ];

  const insertMany = db.transaction((rows) => {
    for (const row of rows) insertProject.run(row);
  });
  insertMany(projects);
  console.log(`Seeded ${projects.length} projects.`);
} else {
  console.log("Projects already seeded, skipping.");
}

if (skillCount === 0) {
  const insertSkill = db.prepare(`
    INSERT INTO skills (name, category, level) VALUES (@name, @category, @level)
  `);

  const skills = [
    { name: "JavaScript", category: "Frontend", level: 90 },
    { name: "React.js", category: "Frontend", level: 85 },
    { name: "HTML & CSS", category: "Frontend", level: 95 },
    { name: "Node.js", category: "Backend", level: 85 },
    { name: "Express.js", category: "Backend", level: 85 },
    { name: "SQL / NoSQL Databases", category: "Backend", level: 75 },
    { name: "Git & GitHub", category: "Tools", level: 90 },
    { name: "Docker", category: "Tools", level: 65 }
  ];

  const insertMany = db.transaction((rows) => {
    for (const row of rows) insertSkill.run(row);
  });
  insertMany(skills);
  console.log(`Seeded ${skills.length} skills.`);
} else {
  console.log("Skills already seeded, skipping.");
}

console.log("Seeding complete.");
