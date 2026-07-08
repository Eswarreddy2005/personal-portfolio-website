const express = require("express");
const db = require("../db");

const router = express.Router();

// GET /api/skills -> list all skills, grouped by category
router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM skills ORDER BY category, level DESC").all();

  const grouped = rows.reduce((acc, skill) => {
    acc[skill.category] = acc[skill.category] || [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  res.json(grouped);
});

module.exports = router;
