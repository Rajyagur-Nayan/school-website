const express = require("express");
const pool = require("../../connections/DB.connect.js");
const multer = require("multer");
const path = require("path");
const {
  uploadToCloudinary,
} = require("../../controllers/cloudinaryUploader.js");

const router = express.Router();

// --- Multer Configuration (remains the same) ---
const upload = multer({ dest: "uploads/" }).fields([
  { name: "student_photo", maxCount: 1 },
]);

// --- REGISTER A NEW STUDENT (POST /) ---
// *** THIS IS THE MODIFIED SECTION ***
router.post("/", upload, async (req, res) => {
  const { ...studentData } = req.body;
  const files = req.files;

  try {
    const studentPhotoFile = files?.student_photo?.[0];

    const [student_photo_url] = await Promise.all([
      uploadToCloudinary(studentPhotoFile),
    ]);

    const studentQuery = `
INSERT INTO student (
admission_number, student_name, date_of_birth, place_of_birth, gender, blood_group,
 nationality, religion, class_id, admission_date, father_name, mother_name,
 parent_primary_phone, parent_secondary_phone, parent_email, address_line1, address_line2,
 city, state, pincode, student_photo_url,
 -- Added new fields
 community, caste_category 
 )
 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
RETURNING id, admission_number, student_name;
`;

    const values = [
      studentData.admission_number,
      studentData.student_name,
      studentData.date_of_birth || null, // Handle null values
      studentData.place_of_birth || null,
      studentData.gender || null,
      studentData.blood_group || null,
      studentData.nationality || "Indian", // Set default if needed
      studentData.religion || null,
      studentData.class_id, // Assuming this is required
      studentData.admission_date || new Date(), // Set default if needed
      studentData.father_name || null,
      studentData.mother_name || null,
      studentData.parent_primary_phone || null,
      studentData.parent_secondary_phone || null,
      studentData.parent_email || null,
      studentData.address_line1 || null,
      studentData.address_line2 || null,
      studentData.city || null,
      studentData.state || null,
      studentData.pincode || null,
      student_photo_url,
      studentData.community || null,
      studentData.caste_category || null,
    ];

    const newStudent = await pool.query(studentQuery, values);

    res.status(201).json({
      message: "Student admitted successfully.",
      student: newStudent.rows[0],
    });
  } catch (err) {
    console.error("Student Admission Error:", err);
    res
      .status(500)
      .json({ error: "An error occurred during the admission process." });
  }
});
// *** END OF MODIFIED SECTION ***

// --- GET A LIST OF ALL STUDENTS (GET /) ---
// (No changes needed for this route)
router.get("/", async (req, res) => {
  try {
    const students = await pool.query(`
      SELECT 
        s.*, 
        c.standard, 
        c.division
      FROM student s
      JOIN classes c ON s.class_id = c.id
      ORDER BY c.standard, c.division, s.student_name;
    `);
    res.status(200).json(students.rows);
  } catch (err) {
    console.error("Get Students Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- NEW: GET THE LAST ADMISSION NUMBER ---
// (No changes needed for this route)
router.get("/last-admission-number", async (req, res) => {
  try {
    // Get the highest (max) ID from the student table
    const { rows } = await pool.query("SELECT MAX(id) as last_id FROM student");

    let nextId; // Check if the table is empty (last_id will be null)

    if (rows.length === 0 || rows[0].last_id === null) {
      // If table is empty, the first ID will be 1
      nextId = 1;
    } else {
      // Otherwise, the next ID is the last (max) ID + 1
      nextId = rows[0].last_id + 1;
    } // Return the calculated *next* student ID

    res.status(200).json({ next_student_id: nextId });
  } catch (err) {
    console.error("Get Next Student ID Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- NEW: UPDATE A STUDENT'S DETAILS ---
/**
 * @route   PATCH /api/admin/students/:id
 * @desc    Update a student's details, including photos.
 * @access  Private (Admin)
 */
// (No changes needed for this route, it's already dynamic)
// This route now correctly listens for PUT requests
router.patch("/:id", upload, async (req, res) => {
  const { id } = req.params;
  const requestBody = { ...req.body };
  const files = req.files;

  // --- NEW: Define ALL allowed fields in the 'student' table ---
  // IMPORTANT: You must update this list to match your database table columns!
  const allowedFields = [
    "student_name",
    "admission_number",
    "status",
    "community",
    "caste_category",
    "class_id", // Assuming you use this to link to the 'classes' table
    "gender",
    "date_of_birth",
    "address",
    "phone_number",
    "father_name",
    "mother_name",
    "father_occupation",
    "mother_occupation",
    // ... add ALL other columns from your 'student' table here
  ];

  // This object will hold only the valid fields to be updated
  const updates = {};

  try {
    // 1. Filter req.body to only include allowed fields
    allowedFields.forEach((key) => {
      if (requestBody[key] !== undefined) {
        updates[key] = requestBody[key];
      }
    });

    // 2. Add new photo URLs (these are generated by the server, so they are safe)
    if (files?.student_photo?.[0]) {
      updates.student_photo_url = await uploadToCloudinary(
        files.student_photo[0]
      );
    }

    // 3. Build the query using the *filtered* 'updates' object
    const fields = Object.keys(updates);

    if (fields.length === 0) {
      return res
        .status(400)
        .json({ error: "No valid fields provided for update." });
    }

    const setClause = fields
      .map((key, index) => `"${key}" = $${index + 1}`) // Use quotes for safety
      .join(", ");

    const values = fields.map((key) => updates[key]);
    values.push(id); // Add the ID for the WHERE clause

    const { rows } = await pool.query(
      `UPDATE student SET ${setClause} WHERE id = $${values.length} RETURNING *`,
      values
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Student not found." });
    }
    res.status(200).json({
      message: "Student details updated successfully",
      student: rows[0],
    });
  } catch (err) {
    console.error("Update Student Error:", err);
    res
      .status(500)
      .json({ error: "An error occurred while updating student details." });
  }
});

// --- NEW: DELETE A STUDENT ---
// (No changes needed for this route)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM student WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Student not found." });
    }
    res.status(200).json({ message: "Student record deleted successfully." });
  } catch (err) {
    console.error("Delete Student Error:", err); // Handle cases where other tables reference this student
    if (err.code === "23503") {
      return res.status(400).json({
        error:
          "Cannot delete student. They have associated records (e.g., fee payments, attendance) that must be removed first.",
      });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
