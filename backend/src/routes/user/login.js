const express = require("express");
// const crypto = require("crypto"); // For generating tokens
const nodemailer = require("nodemailer"); // For sending emails
const { generateToken } = require("../../utils/jwt.js");
const { comparePassword } = require("../../utils/hash.js");
const pool = require("../../connections/DB.connect.js");

require("dotenv").config();

const router = express.Router();

// --- Your Existing Login Route ---
router.post("/", async (req, res) => {
  // Assuming this file is mounted at /login in your main server file
  const { grNo, password } = req.body;

  if (!grNo || !password) {
    return res.status(400).json({ error: "Gr No and password are required" });
  }

  try {
    const DBres = await pool.query("SELECT * FROM users WHERE gr_no = $1", [
      grNo,
    ]);

    if (DBres.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = DBres.rows[0];

    if (!user.password) {
      return res
        .status(401)
        .json({ error: "This account is not configured for password login." });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const studentRes = await pool.query(
      "SELECT id FROM student WHERE admission_number = $1",
      [grNo]
    );

    if (studentRes.rows.length === 0) {
      return res.status(404).json({
        error: "Login successful, but no matching student record found.",
      });
    }

    const studentId = studentRes.rows[0].id;

    const data = {
      id: user.id,
      grNo: user.gr_no,
      firstName: user.first_name, // Assuming you have first_name column
      studentId: studentId,
      role: user.role, // Include user role if available
    };
    const token = generateToken(data);

    const isProduction = "production";

    const cookieOptions = {
      // 👇 In production: allow cross-site cookies (needed for Render + Vercel)
      // 👇 In development: "lax" so cookies work on localhost (HTTP)
      sameSite: isProduction ? "none" : "lax",

      // 👇 Only true in production, because it needs HTTPS
      secure: true,

      // Cookie will last for 7 days
      maxAge: 7 * 24 * 60 * 60 * 1000,

      // Prevents access from JavaScript (helps security)
      httpOnly: true,

      // Ensures the cookie is available for all routes
      path: "/",
    };

    res
      .status(200)
      .cookie("token", token, {
        // This is your main, secure token
        ...cookieOptions,
      })
      // --- THIS IS THE NEW LINE YOU REQUESTED ---
      .cookie("student_id", String(studentId), {
        // This is the separate, accessible student_id
        ...cookieOptions,
      })
      // --- END OF NEW LINE ---
      .json({ message: "Login successful", token, user: data }); // Send user data including role
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
