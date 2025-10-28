const express = require("express");
const pool = require("../../connections/DB.connect.js");

const router = express.Router();

// --- CREATE A NEW EXAM SCHEDULE ENTRY ---
/**
 * @route   POST /api/exams
 * @desc    Schedule a new exam based on the final schema
 * @access  Private (Admin)
 * @body    { "exam_name": "Unit Test 1", "class_id": 1, "subject_id": 2, "exam_date": "2025-11-10", "start_time": "09:00", "total_marks": 25 }
 */
router.post("/", async (req, res) => {
  const {
    exam_name,
    class_id,
    subject_id,
    exam_date,
    start_time,
    total_marks,
  } = req.body;

  // Validation for all required fields in the final table
  const requiredFields = {
    exam_name,
    class_id,
    subject_id,
    exam_date,
    start_time,
    total_marks,
  };
  for (const [field, value] of Object.entries(requiredFields)) {
    if (value === undefined || value === null) {
      return res
        .status(400)
        .json({ error: `Missing required field: ${field}` });
    }
  }

  try {
    const newSchedule = await pool.query(
      `INSERT INTO exam_schedule (exam_name, class_id, subject_id, exam_date, start_time, total_marks)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [exam_name, class_id, subject_id, exam_date, start_time, total_marks]
    );
    res.status(201).json({
      message: "Exam scheduled successfully",
      schedule: newSchedule.rows[0],
    });
  } catch (err) {
    console.error("Schedule Exam Error:", err);
    // Handle a unique constraint violation (if you add one to your table)
    if (err.code === "23505") {
      return res.status(409).json({
        error:
          "This subject is already scheduled for this class in this exam event.",
      });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- GET EXAM SCHEDULE FOR A SPECIFIC CLASS ---
/**
 * @route   GET /api/exams/class/:classId
 * @desc    Get the exam schedule for a class, grouped by exam name
 * @access  Students / Parents / Admin
 */
router.get("/class/:classId", async (req, res) => {
  const { classId } = req.params;
  try {
    const { rows } = await pool.query(
      `
            SELECT 
                es.id,
                es.exam_name,
                s.subject_name,
                es.exam_date,
                TO_CHAR(es.start_time, 'hh12:MI AM') AS start_time, -- Formatted for display
                es.total_marks
            FROM exam_schedule es
            JOIN subjects s ON es.subject_id = s.id
            WHERE es.class_id = $1
            ORDER BY es.exam_name, es.exam_date, es.start_time;
        `,
      [classId]
    );

    // Group results by exam_name for a structured JSON response
    const scheduleByExam = rows.reduce((acc, row) => {
      const { exam_name, ...details } = row;
      if (!acc[exam_name]) {
        acc[exam_name] = [];
      }
      acc[exam_name].push(details);
      return acc;
    }, {});

    res.status(200).json(scheduleByExam);
  } catch (err) {
    console.error("Get Class Schedule Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- UPDATE AN EXAM SCHEDULE ENTRY ---
/**
 * @route   PATCH /api/exams/:id
 * @desc    Update a scheduled exam entry
 * @access  Private (Admin)
 */
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    exam_name,
    class_id,
    subject_id,
    exam_date,
    start_time,
    total_marks,
  } = req.body;

  const updates = {
    exam_name,
    class_id,
    subject_id,
    exam_date,
    start_time,
    total_marks,
  };
  const fields = Object.keys(updates).filter(
    (key) => updates[key] !== undefined
  );

  if (fields.length === 0) {
    return res.status(400).json({ error: "No fields provided for update." });
  }

  const setClause = fields
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");
  const values = fields.map((key) => updates[key]);
  values.push(id); // For the WHERE clause

  try {
    const { rows } = await pool.query(
      `UPDATE exam_schedule SET ${setClause} WHERE id = $${values.length} RETURNING *`,
      values
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Exam schedule entry not found." });
    }
    res.status(200).json({
      message: "Exam schedule updated successfully",
      schedule: rows[0],
    });
  } catch (err) {
    console.error("Update Exam Schedule Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- DELETE AN EXAM SCHEDULE ENTRY ---
/**
 * @route   DELETE /api/exams/:id
 * @desc    Delete a scheduled exam
 * @access  Private (Admin)
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM exam_schedule WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Exam schedule entry not found." });
    }
    res
      .status(200)
      .json({ message: "Exam schedule entry deleted successfully." });
  } catch (err) {
    console.error("Delete Exam Schedule Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
