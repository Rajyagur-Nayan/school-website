const express = require("express");
const crypto = require("crypto"); // For generating tokens
const nodemailer = require("nodemailer"); // For sending emails
const { generateToken } = require("../../utils/jwt.js");
const { comparePassword } = require("../../utils/hash.js");
const pool = require("../../connections/DB.connect.js");

require("dotenv").config();

const router = express.Router();

// --- Nodemailer Setup (Configure with your email provider) ---
// Store these credentials securely in your .env file
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, // e.g., 'gmail', 'sendgrid'
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // For Gmail, use an App Password
  },
});

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

    const cookieOptions = {
      sameSite: "none",
      secure: true, // Should be true in production (requires HTTPS)
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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

// --- NEW: Forgot Password Route ---
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email address is required" });
  }

  try {
    // 1. Find user by email
    const userRes = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    // **Security Note:** Always send a generic success message,
    // even if the email isn't found. This prevents attackers
    // from guessing which emails are registered.
    if (userRes.rows.length === 0) {
      console.log(`Password reset attempt for non-existent email: ${email}`);
      return res.status(200).json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    const user = userRes.rows[0];

    // 2. Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 3600000); // Token valid for 1 hour

    // 3. Store the token and expiry in the database
    //    (Make sure you added reset_token and reset_token_expiry columns)
    await pool.query(
      "UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3",
      [resetToken, tokenExpiry, user.id]
    );

    const resetUrl = `${"http://localhost:3000"}/reset-password?token=${resetToken}`;

    // 5. Send the email using nodemailer
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address (configured in transporter)
      to: user.email, // User's email address
      subject: "Password Reset Request",
      text: `You requested a password reset. Click the following link to reset your password: ${resetUrl}\n\nIf you did not request this, please ignore this email. This link will expire in 1 hour.`,
      html: `<p>You requested a password reset. Click the following link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you did not request this, please ignore this email. This link will expire in 1 hour.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to: ${user.email}`);

    // 6. Send generic success response
    res.status(200).json({
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    // Send a generic error in production
    res
      .status(500)
      .json({ error: "An internal error occurred. Please try again later." });
  }
});

module.exports = router;
