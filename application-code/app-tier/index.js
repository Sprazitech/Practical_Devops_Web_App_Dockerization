// index.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const transactionService = require('./TransactionService');

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(cors());

// Root
app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Welcome to AB3 Transaction API' });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Service is healthy' });
});

// Add transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const { amount, desc } = req.body;
    const id = await transactionService.addTransaction(amount, desc);
    res.status(201).json({ status: 'success', message: 'Transaction added successfully', id });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Get all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const results = await transactionService.getAllTransactions();
    res.status(200).json({ status: 'success', data: results });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Get transaction by ID
app.get('/api/transactions/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const results = await transactionService.findTransactionById(id);
    if (results.length === 0) return res.status(404).json({ status: 'error', message: 'Transaction not found' });
    res.status(200).json({ status: 'success', data: results[0] });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Delete all transactions
app.delete('/api/transactions', async (req, res) => {
  try {
    await transactionService.deleteAllTransactions();
    res.status(200).json({ status: 'success', message: 'All transactions deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Delete transaction by ID
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await transactionService.deleteTransactionById(id);
    res.status(200).json({ status: 'success', message: `Transaction ${id} deleted` });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Export app for testing
module.exports = app;

// Start server if not testing
if (require.main === module) {
  app.listen(port, () => console.log(`Server listening on port ${port}`));
}
