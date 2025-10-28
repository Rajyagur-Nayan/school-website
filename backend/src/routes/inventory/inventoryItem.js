const express = require('express');
const pool = require('../../connections/DB.connect.js');

const router = express.Router();

// --- ADD A NEW ITEM TO INVENTORY ---
/**
 * @route   POST /api/inventory
 * @desc    Add a new item to the school's inventory.
 * @access  Private (Admin)
 */
router.post('/', async (req, res) => {
    const { item_name, category, total_quantity, description } = req.body;

    if (!item_name || total_quantity === undefined) {
        return res.status(400).json({ error: 'item_name and total_quantity are required.' });
    }
    if (isNaN(parseInt(total_quantity)) || total_quantity < 0) {
        return res.status(400).json({ error: 'Total quantity must be a non-negative number.' });
    }

    try {
        // When a new item is added, available_quantity is the same as total_quantity
        const newItem = await pool.query(
            `INSERT INTO school_inventory (item_name, category, total_quantity, available_quantity, description)
             VALUES ($1, $2, $3, $3, $4) RETURNING *`,
            [item_name, category, total_quantity, description]
        );
        res.status(201).json({ message: 'Item added to inventory successfully', item: newItem.rows[0] });
    } catch (err) {
        console.error('Add Inventory Item Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// --- GET A LIST OF ALL INVENTORY ITEMS (with search functionality) ---
/**
 * @route   GET /api/inventory
 * @desc    Get all inventory items, with optional search filters.
 * @access  Private (Admin/Staff)
 */
router.get('/', async (req, res) => {
    const { search, filter_by } = req.query;
    let query = 'SELECT * FROM school_inventory';
    const values = [];

    if (search && filter_by && ['item_name', 'category'].includes(filter_by)) {
        query += ` WHERE ${filter_by} ILIKE $1`; // ILIKE for case-insensitive search
        values.push(`%${search}%`);
    }
    query += ' ORDER BY item_name';

    try {
        const { rows } = await pool.query(query, values);
        res.status(200).json(rows);
    } catch (err) {
        console.error('Get Inventory Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// --- UPDATE INVENTORY ITEM DETAILS (Intelligently handles quantity) ---
/**
 * @route   PATCH /api/inventory/:id
 * @desc    Update an item's details, auto-calculating available quantity if total quantity changes.
 * @access  Private (Admin)
 */
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { item_name, category, total_quantity, description } = req.body;

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'No fields provided for update.' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Start transaction

        // Lock the row for this item to prevent race conditions
        const itemResult = await client.query('SELECT total_quantity, available_quantity FROM school_inventory WHERE id = $1 FOR UPDATE', [id]);
        if (itemResult.rows.length === 0) {
            throw new Error('Item not found.');
        }

        const oldItem = itemResult.rows[0];
        const updates = { item_name, category, description };

        // If total_quantity is being updated, calculate the new available_quantity
        if (total_quantity !== undefined) {
            const newTotal = parseInt(total_quantity, 10);
            if (isNaN(newTotal) || newTotal < 0) {
                throw new Error('Total quantity must be a non-negative number.');
            }
            
            const issuedCount = oldItem.total_quantity - oldItem.available_quantity;
            if (newTotal < issuedCount) {
                throw new Error(`Cannot set total quantity to ${newTotal}, as ${issuedCount} units are currently issued.`);
            }
            updates.total_quantity = newTotal;
            updates.available_quantity = newTotal - issuedCount;
        }

        const fields = Object.keys(updates).filter(key => updates[key] !== undefined);
        if (fields.length === 0) {
            throw new Error("No valid fields provided for update.");
        }

        const setClause = fields.map((key, index) => `${key} = $${index + 1}`).join(', ');
        const values = fields.map(key => updates[key]);
        values.push(id);

        const { rows } = await client.query(`UPDATE school_inventory SET ${setClause} WHERE id = $${values.length} RETURNING *`, values);
        
        await client.query('COMMIT'); // Commit the transaction
        res.status(200).json({ message: 'Item updated successfully', item: rows[0] });
    } catch (err) {
        await client.query('ROLLBACK'); // Roll back on error
        console.error('Update Item Error:', err.message);
        const statusCode = err.message.includes('Cannot set total quantity') ? 400 : 500;
        res.status(statusCode).json({ error: err.message || 'Internal server error' });
    } finally {
        client.release(); // Release the client back to the pool
    }
});

// --- DELETE AN INVENTORY ITEM ---
/**
 * @route   DELETE /api/inventory/:id
 * @desc    Delete an item from the inventory.
 * @access  Private (Admin)
 */
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM school_inventory WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Item not found.' });
        }
        res.status(200).json({ message: 'Item deleted successfully.' });
    } catch (err) {
        console.error('Delete Inventory Item Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

