const express = require('express');
const pool = require('../../connections/DB.connect.js');

const router = express.Router();

router.post('/', async (req, res) => {
    const { standard, division } = req.body;

    if (!standard || !division) {
        return res.status(400).json({ error: 'Both standard and division are required.' });
    }

    try {
        // Check if the class (e.g., Standard 10, Division A) already exists
        const existingClass = await pool.query(
            'SELECT * FROM classes WHERE standard = $1 AND division = $2',
            [standard, division]
        );

        if (existingClass.rows.length > 0) {
            return res.status(409).json({ error: `Class ${standard}-${division} already exists.` });
        }

        // Insert the new class
        const newClass = await pool.query(
            `INSERT INTO classes (standard, division) VALUES ($1, $2) RETURNING *`,
            [standard, division]
        );

        res.status(201).json({
            message: 'Class added successfully.',
            class: newClass.rows[0],
        });

    } catch (err) {
        console.error('Add Class Error:', err);
        // Handle the unique constraint violation from the database
        if (err.code === '23505') {
            return res.status(409).json({ error: `Class ${standard}-${division} already exists.` });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
