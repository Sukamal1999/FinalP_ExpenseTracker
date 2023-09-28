const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authMiddleware = require('../middleware/authMiddleware'); // Import the JWT authentication middleware

// Add Expense route (protected with JWT)
router.post('/addExpense', authMiddleware, async (req, res) => {
    const { amount, description, category } = req.body;
    const userId = req.user.id; // Get the user ID from the JWT payload

    console.log('User ID:', userId);
    console.log('Amount:', amount);
    console.log('Description:', description);
    console.log('Category:', category);

    try {
        const sql = 'INSERT INTO expenses (user_id, amount, description, category) VALUES (?, ?, ?, ?)';
        const values = [userId, amount, description, category];

        const [result] = await pool.execute(sql, values);

        console.log('Insert Result:', result); // Log the result of the SQL execution

        // Send a success response
        res.status(201).json({ message: 'Expense saved successfully' });
    } catch (err) {
        console.error(err);
        // Send an error response
        res.status(500).json({ error: 'Error saving expense' });
    }
});

// Get Expenses route (protected with JWT)
router.get('/getExpenses', authMiddleware, async (req, res) => {
    const userId = req.user.id; // Get the user ID from the JWT payload

    try {
        const [rows] = await pool.query('SELECT * FROM expenses WHERE user_id = ?', [userId]);

        // Send the expenses as JSON
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        // Send an error response
        res.status(500).json({ error: 'Error retrieving expenses' });
    }
});

// Delete Expense route (protected with JWT)
router.delete('/deleteExpense/:id', authMiddleware, async (req, res) => {
    const userId = req.user.id; // Get the user ID from the JWT payload
    const expenseId = req.params.id;

    try {
        // Implement delete logic here, ensuring that the user can only delete their own expenses
        const [result] = await pool.execute('DELETE FROM expenses WHERE user_id = ? AND id = ?', [userId, expenseId]);

        // Check if a record was deleted (result.affectedRows will be 1 if a record was deleted)
        if (result.affectedRows === 1) {
            res.json({ message: 'Expense deleted successfully' });
        } else {
            // If no records were deleted, it means the user either doesn't own the expense or the expense doesn't exist
            res.status(404).json({ error: 'Expense not found or you are not authorized to delete it' });
        }
    } catch (err) {
        console.error(err);
        // Send an error response
        res.status(500).json({ error: 'Error deleting expense' });
    }
});

module.exports = router;
