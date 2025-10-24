

require('dotenv').config();
const transactionService = require('./TransactionService');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// ===== Routes =====

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

// Add Transaction
app.post('/api/transactions', (req, res) => {
  const { amount, desc } = req.body;
  try {
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

// Get All Transactions
app.get('/api/transactions', (req, res) => {
  try {
    transactionService.getAllTransactions(results => {
      const transactionList = results.map(row => ({
        id: row.id,
        amount: row.amount,
        description: row.description
      }));
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

// Delete All Transactions
app.delete('/api/transactions', (req, res) => {
  try {
    transactionService.deleteAllTransactions(result => {
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

// Delete Transaction by ID
app.delete('/api/transactions/:id', (req, res) => {
  try {
    const id = req.params.id;
    transactionService.deleteTransactionById(id, result => {
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

// Get Single Transaction by ID
app.get('/api/transactions/:id', (req, res) => {
  try {
    const id = req.params.id;
    transactionService.findTransactionById(id, result => {
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
