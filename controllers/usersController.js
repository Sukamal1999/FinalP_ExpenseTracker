const bcrypt = require('bcrypt');
const pool = require('../config/database');

async function signup(req, res) {
    const { name, email, password } = req.body;

    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
        res.redirect('/users/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error during signup');
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(404).send('User not found');
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            res.redirect('/users/addExpense');
        } else {
            res.status(401).send('User not authorized');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error during login');
    }
}

module.exports = {
    signup,
    login,
};
