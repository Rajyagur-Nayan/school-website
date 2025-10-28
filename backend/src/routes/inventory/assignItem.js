const express = require('express');
const pool = require('../../connections/DB.connect.js');

const router = express.Router();

// --- 1. GET DATA FOR DROPDOWNS ---

/**
 * @route   GET /api/inventory/transactions/faculty
 * @desc    Get a list of all faculty members for dropdown menus.
 * @access  Private (Admin)
 */
router.get('/faculty', async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT id, f_name, l_name FROM faculty ORDER BY f_name, l_name");
        res.status(200).json(rows);
    } catch (err) {
        console.error('Get Faculty List Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @route   GET /api/inventory/transactions/items
 * @desc    Get a list of all inventory items that are currently in stock.
 * @access  Private (Admin)
 */
router.get('/items', async (req, res) => {
    try {
        // Only shows items where at least one unit is available to be issued
        const { rows } = await pool.query("SELECT id, item_name FROM school_inventory WHERE available_quantity > 0 ORDER BY item_name");
        res.status(200).json(rows);
    } catch (err) {
        console.error('Get Items List Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// --- 2. ISSUE ITEMS (Create or Update a running total) ---

/**
 * @route   POST /api/inventory/transactions/issue
 * @desc    Issue items. Creates a new transaction record or adds to an existing one.
 * @access  Private (Admin)
 * @body    { "faculty_id": 2, "item_id": 3, "quantity_issued": 10 }
 */
router.post('/issue', async (req, res) => {
    const { faculty_id, item_id, quantity_issued } = req.body;
    const quantity = parseInt(quantity_issued, 10);

    if (!faculty_id || !item_id || !quantity || quantity <= 0) {
        return res.status(400).json({ error: 'faculty_id, item_id, and a positive quantity_issued are required.' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Start transaction

        // Step 1: Check availability and lock the master inventory row
        const itemResult = await client.query('SELECT available_quantity FROM school_inventory WHERE id = $1 FOR UPDATE', [item_id]);
        if (itemResult.rows.length === 0) throw new Error('Item not found.');
        if (itemResult.rows[0].available_quantity < quantity) {
            throw new Error(`Not enough quantity available. Only ${itemResult.rows[0].available_quantity} units are in stock.`);
        }

        // Step 2: Decrease the available quantity in the master inventory
        await client.query('UPDATE school_inventory SET available_quantity = available_quantity - $1 WHERE id = $2', [quantity, item_id]);

        // Step 3: Use UPSERT logic for the transaction record
        // If a record for this faculty/item exists, add to quantity_issued. Otherwise, create it.
        const upsertQuery = `
            INSERT INTO inventory_transactions (item_id, faculty_id, quantity_issued)
            VALUES ($1, $2, $3)
            ON CONFLICT (item_id, faculty_id)
            DO UPDATE SET quantity_issued = inventory_transactions.quantity_issued + EXCLUDED.quantity_issued;
        `;
        await client.query(upsertQuery, [item_id, faculty_id, quantity]);

        await client.query('COMMIT');
        res.status(201).json({ message: 'Items issued successfully.' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Issue Item Error:', err.message);
        res.status(400).json({ error: err.message || 'Could not issue items.' });
    } finally {
        client.release();
    }
});


// --- 3. RETURN ITEMS (Decrement from a running total) ---

/**
 * @route   GET /api/inventory/transactions/issued
 * @desc    Get a list of all currently issued items (where quantity > 0).
 * @access  Private (Admin)
 */
router.get('/issued', async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT it.id, si.item_name, f.f_name, f.l_name, it.quantity_issued
            FROM inventory_transactions it
            JOIN school_inventory si ON it.item_id = si.id
            JOIN faculty f ON it.faculty_id = f.id
            WHERE it.quantity_issued > 0
            ORDER BY si.item_name;
        `);
        res.status(200).json(rows);
    } catch (err) {
        console.error('Get Issued Items Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @route   PATCH /api/inventory/transactions/return/:transactionId
 * @desc    Return a specific quantity of an issued item.
 * @access  Private (Admin)
 * @body    { "return_quantity": 3 }
 */
router.patch('/return/:transactionId', async (req, res) => {
    const { transactionId } = req.params;
    const { return_quantity } = req.body;
    const quantity = parseInt(return_quantity, 10);

    if (!quantity || quantity <= 0) {
        return res.status(400).json({ error: 'A positive return_quantity is required.' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Start transaction

        // Step 1: Find the running total record and lock it
        const transactionResult = await client.query("SELECT * FROM inventory_transactions WHERE id = $1 FOR UPDATE", [transactionId]);
        if (transactionResult.rows.length === 0) throw new Error('Transaction not found.');
        
        const transaction = transactionResult.rows[0];
        if (transaction.quantity_issued < quantity) {
            throw new Error(`Cannot return ${quantity} units. Only ${transaction.quantity_issued} are currently issued to this faculty member.`);
        }

        // Step 2: Decrease the issued quantity in the transaction record
        await client.query("UPDATE inventory_transactions SET quantity_issued = quantity_issued - $1 WHERE id = $2", [quantity, transactionId]);
        
        // Step 3: Increase the available quantity in the master inventory
        await client.query('UPDATE school_inventory SET available_quantity = available_quantity + $1 WHERE id = $2', [quantity, transaction.item_id]);

        await client.query('COMMIT');
        res.status(200).json({ message: 'Items returned successfully.' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Return Item Error:', err.message);
        res.status(400).json({ error: err.message || 'Could not return items.' });
    } finally {
        client.release();
    }
});


// --- 4. VIEW HISTORY ---

/**
 * @route   GET /api/inventory/transactions/history
 * @desc    Get a list of issuances where all items have been returned (quantity is 0).
 * @access  Private (Admin)
 */
router.get('/history', async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT it.id, si.item_name, f.f_name, f.l_name, it.created_at, it.updated_at
            FROM inventory_transactions it
            JOIN school_inventory si ON it.item_id = si.id
            JOIN faculty f ON it.faculty_id = f.id
            WHERE it.quantity_issued = 0
            ORDER BY it.updated_at DESC;
        `);
        res.status(200).json(rows);
    } catch (err) {
        console.error('Get History Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

