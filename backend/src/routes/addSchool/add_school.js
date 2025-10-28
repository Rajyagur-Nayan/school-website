const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../../connections/DB.connect.js");

// --- GET: Fetch all colleges ---
// Path: GET /add_school
router.get("/", async (req, res) => {
  try {
    const queryText = `
      SELECT id, name, "createdAt" 
      FROM "College"
      ORDER BY "createdAt" DESC;
    `;

    const { rows } = await pool.query(queryText);
    return res.status(200).json(rows);
  } catch (error) {
    console.error("❌ Failed to fetch colleges:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// --- POST: Register a new school/teacher ---
// Path: POST /add_school
router.post("/", async (req, res) => {
  try {
    // --- 1. Updated to include 'role' ---
    const { name, email, password, role } = req.body;

    // --- 2. Updated validation ---
    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ error: "Name, email, password, and role are required." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // --- 3. Updated INSERT query to include 'role' ---
    const queryText = `
      INSERT INTO "College" (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, "createdAt", role;
    `;
    // --- 4. Added 'role' to parameters ---
    const queryParams = [name, email, hashedPassword, role];

    const { rows } = await pool.query(queryText, queryParams);
    const newCollege = rows[0];

    return res.status(201).json(newCollege);
  } catch (error) {
    if (error.code === "23505") {
      // 23505 is the error code for 'unique_violation'
      // We assume the email is the unique field causing this
      return res.status(409).json({ error: "Email already in use." });
    }

    console.error("❌ Failed to create college:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
