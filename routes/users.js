const express = require('express');
const router = express.Router();
const path = require('path');
const usersController = require('../controllers/usersController');

// Signup route
router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'signup.html'));
});

router.post('/signup', usersController.signup);

// Login route
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'login.html'));
});

router.post('/login', usersController.login);

// Add Expense route (protected, requires login)
router.get('/addExpense', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'addExpense.html'));
});

module.exports = router;
