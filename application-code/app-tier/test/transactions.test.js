process.env.NODE_ENV = 'test';

jest.mock('../TransactionService', () => ({
  addTransaction: jest.fn().mockResolvedValue(1),
  getAllTransactions: jest.fn().mockResolvedValue([{ id: 1, amount: 50, desc: 'Test' }]),
  getTransactionById: jest.fn().mockResolvedValue({ id: 1, amount: 50, desc: 'Test' }),
  deleteTransactionById: jest.fn().mockResolvedValue(true),
  deleteAllTransactions: jest.fn().mockResolvedValue(true),
}));

const request = require('supertest');
const app = require('../index');

describe('Transactions API', () => {

  it('should add a transaction', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .send({ amount: 50, desc: 'Test' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(expect.objectContaining({
      status: 'success',
      id: 1
    }));
  });

  it('should fetch all transactions', async () => {
    const res = await request(app).get('/api/transactions');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should fetch transaction by id', async () => {
    const resAll = await request(app).get('/api/transactions');
    const id = resAll.body.data[0].id;

    const res = await request(app).get(`/api/transactions/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.data).toHaveProperty('id', id);
  });

  it('should delete a transaction by id', async () => {
    const resAll = await request(app).get('/api/transactions');
    const id = resAll.body.data[0].id;

    const res = await request(app).delete(`/api/transactions/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'success');
  });

  it('should delete all transactions', async () => {
    const res = await request(app).delete('/api/transactions');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'success');
  });

});
