const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../../connections/DB.connect.js");
const jwt = require("jsonwebtoken");

// --- POST: Login a school ---
// Path: POST /login_school
router.post("/", async (req, res) => {
  try {
    // 1️⃣ Extract data from request body
    const { email, password, role } = req.body;

    // 2️⃣ Validate input
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ error: "Email, password, and role are required." });
    }

    // 3️⃣ Find the college by email
    const queryText = `
      SELECT id, name, email, password, role 
      FROM "College" 
      WHERE email = $1;
    `;
    const { rows } = await pool.query(queryText, [email]);

    // 4️⃣ Check if college exists
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const college = rows[0];

    // ✅ ADDED: Log the object to debug
    console.log("Database result for college:", college);

    // 5️⃣ Compare hashed password
    const isMatch = await bcrypt.compare(password, college.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // 6️⃣ Compare role
    if (role !== college.role) {
      console.warn(`Role mismatch: [Input: ${role}] vs [DB: ${college.role}]`);
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // 7️⃣ Success — All details match
    // --- NEW: Token & Cookie Logic ---
    if (college.role === "teacher") {
      // 8️⃣ Create JWT Payload
      const payload = {
        id: college.id,
        email: college.email,
        role: college.role,
      };

      // 9️⃣ Sign the Token
      // Make sure you have JWT_SECRET in your .env file
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d", // ✅ CHANGED: Token expires in 7 days
      });

      // 🔟 Set Token in HTTP-Only Cookie
      res.cookie("token", token, {
        secure: "production", // Send only over HTTPS in production
        maxAge: 604800000, // ✅ CHANGED: 7 days in milliseconds
        // path: "/" // Cookie is valid for the entire site
      });
    }
    // --- End of New Logic ---

    // 1️⃣1️⃣ Send final success response
    return res.status(200).json({
      message: "Login successful!",
      college: {
        id: college.id,
        name: college.name,
        email: college.email,
        role: college.role,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
