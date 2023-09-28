const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../config/database');
const config = require('../config/config'); // Import the config for JWT secret
const authMiddleware = require('../middleware/authMiddleware');

// User login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // Generate a JWT token upon successful login
            const payload = {
                user: {
                    id: user.id,
                    name: user.name,
                },
            };

            jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' }, (err, token) => {
                if (err) throw err;
                res.redirect('/addExpense.html')
            });
        } else {
            res.status(401).json({ error: 'User not authorized' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error during login' });
    }
});

// Protected route example (requires JWT authentication)
router.get('/protected', authMiddleware, (req, res) => {
    // Your protected route logic here
    res.json({ message: 'This is a protected route' });
});

module.exports = router;
