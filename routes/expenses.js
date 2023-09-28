const express = require('express');
const router = express.Router();
const path = require('path');
const expensesController = require('../controllers/expensesController');
const authMiddleware = require('../middleware/authMiddleware');

// Add the authMiddleware to protect this route
router.get('/protected', authMiddleware, (req, res) => {
    // Your protected route logic here
    res.json({ message: 'This is a protected route' });
});
// Add Expense route (protected, requires login)
router.get('/addExpense', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'addExpense.html'));
});

router.post('/addExpense', expensesController.addExpense);

// Get Expenses route
router.get('/getExpenses', expensesController.getExpenses);

// Delete Expense route (you can implement this if needed)
router.delete('/deleteExpense/:id', expensesController.deleteExpense);

module.exports = router;
