const express = require("express");
const pool = require("../../connections/DB.connect.js");

const router = express.Router();

// --- GET THE FULL TIMETABLE (with human-readable names) ---
/**
 * @route   GET /api/admin/timetable
 * @desc    Get the entire school timetable, joined with readable names
 * @access  Private (Admin Only)
 */
router.get("/", async (req, res) => {
  try {
    // A comprehensive JOIN query to make the data easy for the frontend to display.
    const timetableData = await pool.query(`
            SELECT 
                t.id AS timetable_id,
                p.day,
                p.period_number,
                p.start_time,
                p.end_time,
                c.standard,
                c.division,
                s.subject_name,
                f.f_name,
                f.l_name
            FROM timetable t
            JOIN periods p ON t.period_id = p.id
            JOIN classes c ON t.class_id = c.id
            JOIN subjects s ON t.subject_id = s.id
            JOIN faculty f ON t.faculty_id = f.id
            ORDER BY 
                CASE p.day
                    WHEN 'Monday' THEN 1
                    WHEN 'Tuesday' THEN 2
                    WHEN 'Wednesday' THEN 3
                    WHEN 'Thursday' THEN 4
                    WHEN 'Friday' THEN 5
                    WHEN 'Saturday' THEN 6
                END,
                p.period_number,
                c.standard,
                c.division;
        `);

    res.status(200).json(timetableData.rows);
  } catch (err) {
    console.error("Get Timetable Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- CREATE OR UPDATE A TIMETABLE ENTRY (UPSERT) ---
/**
 * @route   POST /api/admin/timetable
 * @desc    Create a new timetable entry or update if it exists (Upsert)
 * @access  Private (Admin Only)
 */
router.post("/", async (req, res) => {
  const { period_id, class_id, subject_id, faculty_id } = req.body;

  if (!period_id || !class_id || !subject_id || !faculty_id) {
    return res.status(400).json({
      error:
        "period_id, class_id, subject_id, and faculty_id are all required.",
    });
  }

  try {
    // This is the "UPSERT" query.
    const query = `
            INSERT INTO timetable (period_id, class_id, subject_id, faculty_id)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (period_id, class_id) 
            DO UPDATE SET 
                subject_id = EXCLUDED.subject_id,
                faculty_id = EXCLUDED.faculty_id
            RETURNING *;
        `;

    const values = [period_id, class_id, subject_id, faculty_id];
    const result = await pool.query(query, values);

    // Check if a new row was created or an existing one was updated
    const wasCreated =
      result.rows[0].created_at.getTime() ===
      result.rows[0].updated_at.getTime();

    res.status(wasCreated ? 201 : 200).json({
      message: `Timetable entry ${
        wasCreated ? "created" : "updated"
      } successfully.`,
      entry: result.rows[0],
    });
  } catch (err) {
    console.error("Upsert Timetable Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- UPDATE A TIMETABLE ENTRY (PATCH) ---
/**
 * @route   PATCH /api/admin/timetable/:id
 * @desc    Update a specific timetable entry by ID
 * @access  Private (Admin Only)
 */
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { period_id, subject_id, faculty_id } = req.body;

  // Build updates dynamically as you do already
  const updates = { period_id, subject_id, faculty_id };
  const fields = Object.keys(updates).filter((k) => updates[k] !== undefined);

  if (fields.length === 0) {
    return res.status(400).json({ error: "No fields provided for update." });
  }

  const values = fields.map((k) => updates[k]);

  try {
    // If period_id and class_id are being changed, check conflict
    if (period_id !== undefined) {
      const conflictCheck = await pool.query(
        `SELECT id FROM timetable WHERE period_id = $1 AND id <> $2 LIMIT 1`,
        [period_id, id]
      );
      if (conflictCheck.rowCount > 0) {
        return res.status(409).json({
          error:
            "Another timetable entry already occupies that Period + Class slot.",
        });
      }
    } else if (period_id !== undefined) {
      // If only one of them provided, fetch existing other value to form full slot check
      const rowRes = await pool.query(
        "SELECT period_id FROM timetable WHERE id = $1",
        [id]
      );
      if (rowRes.rowCount === 0)
        return res.status(404).json({ error: "Timetable entry not found." });
      const existing = rowRes.rows[0];
      const newPeriod =
        period_id !== undefined ? period_id : existing.period_id;

      const conflictCheck = await pool.query(
        `SELECT id FROM timetable WHERE period_id = $1 AND id <> $2 LIMIT 1`,
        [newPeriod, id]
      );
      if (conflictCheck.rowCount > 0) {
        return res.status(409).json({
          error:
            "Another timetable entry already occupies that Period + Class slot.",
        });
      }
    }

    // Build SET clause
    const setClause = fields
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");
    values.push(id);

    const result = await pool.query(
      `UPDATE timetable SET ${setClause}, updated_at = now() WHERE id = $${values.length} RETURNING *`,
      values
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Timetable entry not found." });

    res.status(200).json({
      message: "Timetable entry updated successfully.",
      entry: result.rows[0],
    });
  } catch (err) {
    console.error("Update Timetable Error:", err);
    if (err.code === "23505") {
      return res.status(409).json({
        error: "A timetable entry already exists for this Period and Class.",
      });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- DELETE A TIMETABLE ENTRY (DELETE) ---
/**
 * @route   DELETE /api/admin/timetable/:id
 * @desc    Delete a specific timetable entry by ID
 * @access  Private (Admin Only)
 */
// DELETE by DB id:
// DELETE /api/admin/timetable/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Missing id parameter." });

  try {
    const result = await pool.query(
      "DELETE FROM timetable WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Timetable entry not found." });
    }
    return res.status(200).json({
      message: "Timetable entry deleted successfully.",
      deleted: result.rows[0],
    });
  } catch (err) {
    console.error("Delete by id failed:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE by slot (period_id + class_id) via query params:
// DELETE /api/admin/timetable?period_id=1&class_id=2
router.delete("/", async (req, res) => {
  const period_id = req.query.period_id ? Number(req.query.period_id) : null;

  if (!period_id) {
    return res.status(400).json({
      error:
        "Provide period_id and class_id as query parameters to delete by slot. Example: /api/admin/timetable?period_id=1&class_id=2",
    });
  }

  try {
    const result = await pool.query(
      "DELETE FROM timetable WHERE period_id = $1 AND class_id = $2 RETURNING *",
      [period_id, class_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Timetable slot not found for the given period and class.",
      });
    }

    return res.status(200).json({
      message: "Timetable slot deleted successfully.",
      deleted: result.rows[0],
    });
  } catch (err) {
    console.error("Delete by slot failed:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// --- GET DATA FOR DROPDOWNS (for the frontend form) ---
/**
 * @route   GET /api/admin/timetable/form-data
 * @desc    Get all periods, classes, subjects, and faculty for UI dropdowns
 * @access  Private (Admin Only)
 */
router.get("/form-data", async (req, res) => {
  let client;
  try {
    client = await pool.connect();

    const [periods, classes, subjects, faculty] = await Promise.all([
      client.query(
        "SELECT id, day, period_number FROM periods ORDER BY day, period_number"
      ),
      client.query(
        "SELECT id, standard, division FROM classes ORDER BY standard, division"
      ),
      client.query(
        "SELECT id, subject_name FROM subjects ORDER BY subject_name"
      ),
      client.query(
        "SELECT id, F_name, L_name FROM faculty ORDER BY F_name, L_name"
      ),
    ]);

    res.status(200).json({
      periods: periods.rows,
      classes: classes.rows,
      subjects: subjects.rows,
      faculty: faculty.rows,
    });
  } catch (err) {
    console.error("Get Timetable Form Data Error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (client) client.release();
  }
});

module.exports = router;
