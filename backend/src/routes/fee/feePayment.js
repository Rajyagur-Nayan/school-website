const express = require("express");
const pool = require("../../connections/DB.connect.js");

const router = express.Router();

// --- 1. GET ALL STUDENTS (Unchanged) ---
router.get("/students", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT s.id, s.student_name, c.standard, c.division
      FROM student s
      JOIN classes c ON s.class_id = c.id
      ORDER BY s.student_name;
    `);

    const formattedStudents = rows.map((student) => ({
      id: student.id,
      display_name: `${student.student_name} - Class ${student.standard} ${student.division}`,
    }));

    res.status(200).json(formattedStudents);
  } catch (err) {
    console.error("Get Students Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- 2. GET DUES FOR SINGLE STUDENT (Modified for "extra_amount") ---
router.get("/dues/:studentId", async (req, res) => {
  const { studentId } = req.params;

  // This query assumes 'transport_assignments' table exists
  const query = `
    WITH student_class AS (
      SELECT class_id FROM student WHERE id = $1
    ),
    class_dues AS (
      SELECT COALESCE(SUM(amount), 0) AS total FROM fee_types
      WHERE class_id = (SELECT class_id FROM student_class)
    ),
    transport_fee AS (
      -- Assuming transport_assignments table exists for individual fees
      SELECT COALESCE(SUM(fee_amount), 0) AS total FROM transport_assignments
      WHERE student_id = $1
    ),
    total_paid AS (
      SELECT COALESCE(SUM(amount_paid), 0) AS total FROM fee_payments
      WHERE student_id = $1
    ),
    calculated_totals AS (
      SELECT 
        (SELECT total FROM class_dues) + (SELECT total FROM transport_fee) AS total_dues,
        (SELECT total FROM total_paid) AS total_paid
    )
    SELECT 
      ct.total_dues::NUMERIC,
      ct.total_paid::NUMERIC,
      (ct.total_dues - ct.total_paid)::NUMERIC AS balance_due,
      -- NEW: Calculate extra amount (only if balance is negative)
      CASE
        WHEN (ct.total_dues - ct.total_paid) < 0 
        THEN (ct.total_paid - ct.total_dues)::NUMERIC
        ELSE 0::NUMERIC
      END AS extra_amount
    FROM calculated_totals ct;
  `;

  try {
    const { rows } = await pool.query(query, [studentId]);
    if (!rows[0]) return res.status(404).json({ error: "Student not found." });
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Get Student Dues Error:", err);
    // This will catch if student table or transport_assignments doesn't exist
    if (err.code === "42P01") {
      console.error(
        "Database table not found. Did you mean 'students' or 'transport_assignments'?"
      );
      return res
        .status(500)
        .json({ error: "Internal server error, table not found." });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- 3. RECORD A NEW PAYMENT (Modified with Validation) ---
router.post("/", async (req, res) => {
  const { student_id, amount_paid, payment_mode } = req.body;

  // --- START FIX ---
  // Validate amount_paid *before* the query
  if (!amount_paid || parseFloat(amount_paid) <= 0) {
    return res.status(400).json({
      error: "Payment amount must be a positive number.",
    });
  }
  // --- END FIX ---

  if (!student_id || !payment_mode) {
    return res.status(400).json({
      error: "student_id and payment_mode are required.",
    });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO fee_payments (student_id, amount_paid, payment_mode)
       VALUES ($1, $2, $3) RETURNING *`,
      [student_id, amount_paid, payment_mode]
    );

    res
      .status(201)
      .json({ message: "Payment recorded successfully", payment: rows[0] });
  } catch (err) {
    console.error("Record Payment Error:", err);
    if (err.code === "23503")
      return res.status(404).json({ error: "Student not found." });
    // This catch block will no longer be hit for '23514' (check constraint)
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- 4. GET DUES REPORT FOR ALL STUDENTS (Corrected) ---
// This query also assumes 'transport_assignments' exists
router.get("/report", async (req, res) => {
  const { student_name, class_id } = req.query;
  const values = [];
  let paramIndex = 1;

  let query = `
    SELECT
      s.id AS student_id,
      s.student_name,
      c.standard || ' ' || c.division AS class,
      (COALESCE(cf.total_dues, 0) + COALESCE(ta.fee_amount, 0))::NUMERIC AS total_dues,
      COALESCE(sp.total_paid, 0)::NUMERIC AS paid,
      ((COALESCE(cf.total_dues, 0) + COALESCE(ta.fee_amount, 0)) - COALESCE(sp.total_paid, 0))::NUMERIC AS balance,
      CASE
        -- Renamed 'students' to 'student' in FROM clause
        WHEN ((COALESCE(cf.total_dues, 0) + COALESCE(ta.fee_amount, 0)) - COALESCE(sp.total_paid, 0)) <= 0 AND (COALESCE(cf.total_dues, 0) + COALESCE(ta.fee_amount, 0)) > 0 THEN 'Paid'
        WHEN COALESCE(sp.total_paid, 0) = 0 AND (COALESCE(cf.total_dues, 0) + COALESCE(ta.fee_amount, 0)) > 0 THEN 'Unpaid'
        WHEN (COALESCE(cf.total_dues, 0) + COALESCE(ta.fee_amount, 0)) = 0 THEN 'No Dues'
        ELSE 'Partial'
      END AS status
    FROM student s -- Corrected table name from 'students'
    JOIN classes c ON s.class_id = c.id
    LEFT JOIN (
      SELECT class_id, SUM(amount) AS total_dues
      FROM fee_types
      GROUP BY class_id
    ) AS cf ON s.class_id = cf.class_id
    LEFT JOIN (
      SELECT student_id, SUM(amount_paid) AS total_paid
      FROM fee_payments
      GROUP BY student_id
    ) AS sp ON s.id = sp.student_id
    LEFT JOIN (
      -- Assuming one transport fee per student. If multiple, use SUM and GROUP BY.
      SELECT student_id, fee_amount 
      FROM transport_assignments
    ) ta ON s.id = ta.student_id
    WHERE 1=1
  `;

  if (student_name) {
    query += ` AND s.student_name ILIKE $${paramIndex}`;
    values.push(`%${student_name}%`);
    paramIndex++;
  }

  if (class_id) {
    query += ` AND s.class_id = $${paramIndex}`;
    values.push(class_id);
    paramIndex++;
  }

  query += " ORDER BY c.standard, c.division, s.student_name;";

  try {
    const { rows } = await pool.query(query, values);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Get Dues Report Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
