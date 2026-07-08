const express = require("express");
const db = require("../db");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

// POST /api/contact -> save a message from the contact form
router.post("/", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "name, email, and message are required" });
  }

  const stmt = db.prepare("INSERT INTO messages (name, email, message) VALUES (?, ?, ?)");
  const info = stmt.run(name, email, message);

  res.status(201).json({ success: true, id: info.lastInsertRowid });
});

// GET /api/contact -> list messages (admin only, e.g. to check your inbox)
router.get("/", requireAdmin, (req, res) => {
  const rows = db.prepare("SELECT * FROM messages ORDER BY created_at DESC").all();
  res.json(rows);
});

module.exports = router;
