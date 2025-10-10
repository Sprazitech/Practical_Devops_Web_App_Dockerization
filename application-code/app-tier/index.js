require('dotenv').config();
const transactionService = require('./TransactionService');
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const os = require('os');
const fetch = require('node-fetch');

const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// This is for troubleshooting to print the credentials on the terminal
console.log('DB_HOST:', process.env.DB_HOST,);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_DATABASE:', process.env.DB_DATABASE);


// Database client setup
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  });

  db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to the MySQL database.');
  });

// Function to create table if it doesn't exist
function createTables() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS transactions (
        id INT NOT NULL AUTO_INCREMENT,
        amount DECIMAL(10,2),
        description VARCHAR(100),
        PRIMARY KEY(id)
      );
    `;
  
    db.query(createTableQuery, (err, results) => {
      if (err) {
        console.error('Error creating table:', err);
        return;
      }
      console.log('Table "transactions" created or already exists.');
    });
  }



  // Run the function to create tables
createTables();


// // ROUTES FOR OUR API
// // =======================================================

// // Health Checking
// app.get('/health',(req,res)=>{
//     res.json("This is the health check");
// });



// // ADD TRANSACTION
// app.post('/api/transactions', (req,res)=>{
//     var response = "";
//     try{
//         console.log(req.body);
//         console.log(req.body.amount);
//         console.log(req.body.desc);
//         var success = transactionService.addTransaction(req.body.amount,req.body.desc);
//         if (success === 200) res.json({ message: 'added transaction successfully'});
//     }catch (err){
//         res.json({ message: 'something went wrong', error : err.message});
//     }
// });

// // GET ALL TRANSACTIONS
// app.get('/api/transactions',(req,res)=>{
//     try{
//         var transactionList = [];
//        transactionService.getAllTransactions(function (results) {
//             console.log("we are in the call back:");
//             for (const row of results) {
//                 transactionList.push({ "id": row.id, "amount": row.amount, "description": row.description });
//             }
//             console.log(transactionList);
//             res.statusCode = 200;
//             res.json({"result":transactionList});
//         });
//     }catch (err){
//         res.json({message:"could not get all transactions",error: err.message});
//     }
// });

// //DELETE ALL TRANSACTIONS
// app.delete('/api/transactions',(req,res)=>{
//     try{
//         transactionService.deleteAllTransactions(function(result){
//             res.statusCode = 200;
//             res.json({message:"delete function execution finished."})
//         })
//     }catch (err){
//         res.json({message: "Deleting all transactions may have failed.", error:err.message});
//     }
// });

// // DELETE one transaction by ID
// app.delete('/api/transactions/:id', (req, res) => {
//   try {
//     const id = req.params.id;
//     transactionService.deleteTransactionById(id, function(result) {
//       res.status(200).json({ message: `Transaction with id ${id} deleted.` });
//     });
//   } catch (err) {
//     res.json({ message: "Error deleting transaction", error: err.message });
//   }
// });

// // GET single transaction by ID
// app.get('/api/transactions/:id', (req, res) => {
//   try {
//     const id = req.params.id;
//     transactionService.findTransactionById(id, function(result) {
//       if (result.length > 0) {
//         const { id, amount, description } = result[0];
//         res.status(200).json({ id, amount, description });
//       } else {
//         res.status(404).json({ message: "Transaction not found" });
//       }
//     });
//   } catch (err) {
//     res.json({ message: "Error retrieving transaction", error: err.message });
//   }
// });


//   app.listen(port, () => {
//     console.log(`AB3 backend app listening at http://localhost:${port}`)
//   })

// ROUTES FOR OUR API
// =======================================================

// Root Welcome Route
app.get('/', (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to the AB3 Transaction API"
  });
});

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Service is healthy"
  });
});

// ADD TRANSACTION
app.post('/api/transactions', (req, res) => {
  try {
    const { amount, desc } = req.body;
    console.log("Add Transaction Request:", req.body);

    const success = transactionService.addTransaction(amount, desc);
    if (success === 200) {
      res.status(201).json({
        status: "success",
        message: "Transaction added successfully"
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Could not add transaction"
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: err.message
    });
  }
});

// GET ALL TRANSACTIONS
app.get('/api/transactions', (req, res) => {
  try {
    transactionService.getAllTransactions(function (results) {
      const transactionList = results.map(row => ({
        id: row.id,
        amount: row.amount,
        description: row.description
      }));

      console.log("Fetched Transactions:", transactionList);

      res.status(200).json({
        status: "success",
        data: transactionList
      });
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Could not get all transactions",
      error: err.message
    });
  }
});

// DELETE ALL TRANSACTIONS
app.delete('/api/transactions', (req, res) => {
  try {
    transactionService.deleteAllTransactions(function(result) {
      res.status(200).json({
        status: "success",
        message: "All transactions deleted successfully"
      });
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Deleting all transactions may have failed",
      error: err.message
    });
  }
});

// DELETE ONE TRANSACTION BY ID
app.delete('/api/transactions/:id', (req, res) => {
  try {
    const id = req.params.id;
    transactionService.deleteTransactionById(id, function(result) {
      res.status(200).json({
        status: "success",
        message: `Transaction with id ${id} deleted successfully`
      });
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Error deleting transaction",
      error: err.message
    });
  }
});

// GET SINGLE TRANSACTION BY ID
app.get('/api/transactions/:id', (req, res) => {
  try {
    const id = req.params.id;
    transactionService.findTransactionById(id, function(result) {
      if (result.length > 0) {
        const { id, amount, description } = result[0];
        res.status(200).json({
          status: "success",
          data: { id, amount, description }
        });
      } else {
        res.status(404).json({
          status: "error",
          message: "Transaction not found"
        });
      }
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Error retrieving transaction",
      error: err.message
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`AB3 backend app listening at http://localhost:${port}`);
});
