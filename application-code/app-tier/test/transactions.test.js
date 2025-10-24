const request = require('supertest');
const app = require('../index');

describe('Transactions API', () => {

  it('should add a transaction', async () => {
    const res = await request(app).post('/api/transactions').send({ amount: 50, desc: 'Test' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should fetch all transactions', async () => {
    const res = await request(app).get('/api/transactions');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should fetch transaction by id', async () => {
    const resAll = await request(app).get('/api/transactions');
    const id = resAll.body.data[0].id;
    const res = await request(app).get(`/api/transactions/${id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('id', id);
  });

  it('should delete a transaction by id', async () => {
    const resAll = await request(app).get('/api/transactions');
    const id = resAll.body.data[0].id;
    const res = await request(app).delete(`/api/transactions/${id}`);
    expect(res.statusCode).toEqual(200);
  });

  it('should delete all transactions', async () => {
    const res = await request(app).delete('/api/transactions');
    expect(res.statusCode).toEqual(200);
  });
});
