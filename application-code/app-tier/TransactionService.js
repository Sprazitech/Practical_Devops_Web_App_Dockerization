// const dbcreds = require('./DbConfig');
// const mysql = require('mysql');

// const con = mysql.createConnection({
//   host: dbcreds.DB_HOST,
//   user: dbcreds.DB_USER,
//   password: dbcreds.DB_PWD,
//   database: dbcreds.DB_DATABASE
// });

// con.connect(err => {
//   if (err) throw err;
//   console.log("Connected to MySQL database");
// });

// // Use Promises for all DB operations
// function addTransaction(amount, desc) {
//   const query = `INSERT INTO transactions (amount, description) VALUES (?, ?)`;
//   return new Promise((resolve, reject) => {
//     con.query(query, [amount, desc], (err, result) => {
//       if (err) return reject(err);
//       resolve(result.insertId);
//     });
//   });
// }

// function getAllTransactions() {
//   const query = "SELECT * FROM transactions";
//   return new Promise((resolve, reject) => {
//     con.query(query, (err, results) => {
//       if (err) return reject(err);
//       resolve(results);
//     });
//   });
// }

// function findTransactionById(id) {
//   const query = "SELECT * FROM transactions WHERE id = ?";
//   return new Promise((resolve, reject) => {
//     con.query(query, [id], (err, results) => {
//       if (err) return reject(err);
//       resolve(results);
//     });
//   });
// }

// function deleteAllTransactions() {
//   const query = "DELETE FROM transactions";
//   return new Promise((resolve, reject) => {
//     con.query(query, (err, results) => {
//       if (err) return reject(err);
//       resolve(results);
//     });
//   });
// }

// function deleteTransactionById(id) {
//   const query = "DELETE FROM transactions WHERE id = ?";
//   return new Promise((resolve, reject) => {
//     con.query(query, [id], (err, results) => {
//       if (err) return reject(err);
//       resolve(results);
//     });
//   });
// }

// module.exports = {
//   addTransaction,
//   getAllTransactions,
//   findTransactionById,
//   deleteAllTransactions,
//   deleteTransactionById
// };


// TransactionService.js
const pool = require('./DbConfig');

class TransactionService {

  static async addTransaction(amount, desc) {
    const sql = 'INSERT INTO transactions (amount, description) VALUES (?, ?)';
    const [result] = await pool.execute(sql, [amount, desc]);
    return result.insertId;
  }

  static async getAllTransactions() {
    const sql = 'SELECT * FROM transactions';
    const [rows] = await pool.execute(sql);
    return rows;
  }

  static async findTransactionById(id) {
    const sql = 'SELECT * FROM transactions WHERE id = ?';
    const [rows] = await pool.execute(sql, [id]);
    return rows;
  }

  static async deleteAllTransactions() {
    const sql = 'DELETE FROM transactions';
    await pool.execute(sql);
    return true;
  }

  static async deleteTransactionById(id) {
    const sql = 'DELETE FROM transactions WHERE id = ?';
    await pool.execute(sql, [id]);
    return true;
  }
}

module.exports = TransactionService;
