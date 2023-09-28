const mysql = require('mysql2');

const pool = mysql.createPool({
    connectionLimit: 10, // Adjust as needed
    host: 'localhost',
    user: 'root',
    password: 'sukamal',
    database: 'expense_tracker',
});

module.exports = pool.promise(); // Export the pool for using promises
