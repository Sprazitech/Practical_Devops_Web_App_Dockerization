
const mysql = require('mysql');
const dbcreds = require('./DbConfig');

// Create MySQL connection
const con = mysql.createConnection({
    host: dbcreds.DB_HOST,
    user: dbcreds.DB_USER,
    password: dbcreds.DB_PWD,
    database: dbcreds.DB_DATABASE
});

// Connect once at startup
con.connect(err => {
    if (err) {
        console.error('DB connection error:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL database');
});

// Add a transaction safely
function addTransaction(amount, desc) {
    const sql = 'INSERT INTO `transactions` (`amount`, `description`) VALUES (?, ?)';
    con.query(sql, [amount, desc], (err, result) => {
        if (err) throw err;
        console.log('Transaction added successfully');
    });
    return 200;
}

// Get all transactions
function getAllTransactions(callback) {
    const sql = 'SELECT * FROM `transactions`';
    con.query(sql, (err, results) => {
        if (err) throw err;
        callback(results);
    });
}

// Find transaction by ID safely
function findTransactionById(id, callback) {
    const sql = 'SELECT * FROM `transactions` WHERE id = ?';
    con.query(sql, [id], (err, results) => {
        if (err) throw err;
        callback(results);
    });
}

// Delete all transactions
function deleteAllTransactions(callback) {
    const sql = 'DELETE FROM `transactions`';
    con.query(sql, (err, results) => {
        if (err) throw err;
        callback(results);
    });
}

// Delete transaction by ID safely
function deleteTransactionById(id, callback) {
    const sql = 'DELETE FROM `transactions` WHERE id = ?';
    con.query(sql, [id], (err, results) => {
        if (err) throw err;
        callback(results);
    });
}

module.exports = {
    addTransaction,
    getAllTransactions,
    deleteAllTransactions,
    findTransactionById,
    deleteTransactionById
};


