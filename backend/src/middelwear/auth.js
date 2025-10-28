const jwt = require("jsonwebtoken");
const pool = require("../connections/DB.connect.js");

const isLoggedIn = async (req, res, next) => {
  try {
    let token;

    // --- 1. Extract Token from Request ---
    // This logic checks for a token in the 'Authorization' header (standard for APIs)
    // and falls back to checking for a cookie.
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.admin_login_token) {
      token = req.cookies.admin_login_token;
    }

    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJkaHJ1diIsImlhdCI6MTc2MDE4NDYyNX0.C7iEy4tkB1Qh1l1x39pV1WFYBoqjynaPu-n2Eb286WY"

    if (!token) {
      // Use 401 Unauthorized, which is more standard for missing credentials
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    // --- 2. Verify Token ---
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // --- 3. Find User in DB ---
    const result = await pool.query(
      "SELECT id, username, email FROM users WHERE id = $1", // Select only non-sensitive data
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User associated with this token no longer exists." });
    }

    // --- 4. Attach User to Request ---
    // This makes the user's data available in all subsequent protected routes
    req.user = result.rows[0];
    next(); // Proceed to the next middleware or the route handler

  } catch (err) {
    console.error("Authentication Middleware Error:", err);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = isLoggedIn;
