const express = require("express");
const db = require("../db");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

function rowToProject(row) {
  return {
    ...row,
    tech_stack: row.tech_stack ? row.tech_stack.split(",") : [],
    featured: !!row.featured
  };
}

// GET /api/projects  -> list all projects (optional ?featured=true)
router.get("/", (req, res) => {
  const { featured } = req.query;
  let rows;
  if (featured === "true") {
    rows = db.prepare("SELECT * FROM projects WHERE featured = 1 ORDER BY created_at DESC").all();
  } else {
    rows = db.prepare("SELECT * FROM projects ORDER BY created_at DESC").all();
  }
  res.json(rows.map(rowToProject));
});

// GET /api/projects/:id -> single project
router.get("/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM projects WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Project not found" });
  res.json(rowToProject(row));
});

// POST /api/projects -> create a project (admin only)
router.post("/", requireAdmin, (req, res) => {
  const { title, description, tech_stack, image_url, github_url, live_url, featured } = req.body;

  if (!title || !description || !tech_stack) {
    return res.status(400).json({ error: "title, description, and tech_stack are required" });
  }

  const stmt = db.prepare(`
    INSERT INTO projects (title, description, tech_stack, image_url, github_url, live_url, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const techString = Array.isArray(tech_stack) ? tech_stack.join(",") : tech_stack;
  const info = stmt.run(
    title,
    description,
    techString,
    image_url || "",
    github_url || "",
    live_url || "",
    featured ? 1 : 0
  );

  const created = db.prepare("SELECT * FROM projects WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json(rowToProject(created));
});

// DELETE /api/projects/:id -> remove a project (admin only)
router.delete("/:id", requireAdmin, (req, res) => {
  const info = db.prepare("DELETE FROM projects WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Project not found" });
  res.json({ success: true });
});

module.exports = router;
