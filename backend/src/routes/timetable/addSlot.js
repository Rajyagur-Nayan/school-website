const express = require('express');
const pool = require('../../connections/DB.connect.js');

const router = express.Router();

router.get('/', async (req, res) => {
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
        console.error('Get Timetable Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// --- CREATE OR UPDATE A TIMETABLE ENTRY (UPSERT) ---

router.post('/', async (req, res) => {
    const { period_id, class_id, subject_id, faculty_id } = req.body;

    if (!period_id || !class_id || !subject_id || !faculty_id) {
        return res.status(400).json({ error: 'period_id, class_id, subject_id, and faculty_id are all required.' });
    }

    try {
        // This is the "UPSERT" query.
        // It tries to INSERT. If it fails due to the unique constraint on (period_id, class_id),
        // it then performs an UPDATE on the conflicting row instead.
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
        const wasCreated = result.rows[0].created_at.getTime() === result.rows[0].updated_at.getTime();

        res.status(wasCreated ? 201 : 200).json({
            message: `Timetable entry ${wasCreated ? 'created' : 'updated'} successfully.`,
            entry: result.rows[0]
        });

    } catch (err) {
        console.error('Upsert Timetable Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// --- GET DATA FOR DROPDOWNS (for the frontend form) ---
router.get('/form-data', async (req, res) => {
    let client;
    try {
        client = await pool.connect();

        const periods = await client.query(
            'SELECT id, day, period_number FROM periods ORDER BY day, period_number'
        );
        const classes = await client.query(
            'SELECT id, standard, division FROM classes ORDER BY standard, division'
        );
        const subjects = await client.query(
            'SELECT id, subject_name FROM subjects ORDER BY subject_name'
        );
        const faculty = await client.query(
            'SELECT id, F_name, L_name FROM faculty ORDER BY F_name, L_name'
        );

        res.status(200).json({
            periods: periods.rows,
            classes: classes.rows,
            subjects: subjects.rows,
            faculty: faculty.rows
        });
    } catch (err) {
        console.error('Get Timetable Form Data Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (client) client.release();
    }
});


module.exports = router;

// const samester = ["U.K.G.", "C.K.G.", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th-sci", "11th-com", "11th-art", "12th-sci", "12th-com", "12th-art"]