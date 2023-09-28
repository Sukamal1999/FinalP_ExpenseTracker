const pool = require('../config/database');

// Create expense
exports.createExpense = async (req, res) => {
    try {
        const { amount, description, category } = req.body;
        const userId = req.user.id; // Get the user ID from the JWT payload

        const sql = 'INSERT INTO expenses (user_id, amount, description, category) VALUES (?, ?, ?, ?)';
        console.log('SQL Query:', sql);
        const values = [userId, amount, description, category];

        const [result] = await pool.execute(sql, values);

        // Check if the expense was inserted successfully
        if (result.affectedRows === 1) {
            res.status(201).json({ message: 'Expense saved successfully' });
        } else {
            res.status(500).json({ error: 'Error saving expense' });
        }

        // Debug log to print received data
        console.log('Received data:', amount, description, category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error saving expense' });
    }
};

// Get expenses
exports.getExpenses = async (req, res) => {
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
};
