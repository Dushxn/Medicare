const request = require('supertest');
const express = require('express');
const userRoute = require('../routes/userRoutes');
const setup = require('./setup');

const app = express();
app.use(express.json());
app.use('/api/users', userRoute);

beforeAll(async () => {
  await setup();
});

afterAll(async () => {
  await setup.teardown();
});

describe('User Routes', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Alice',
        email: 'alice@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
    expect(res.body.user).toHaveProperty('email', 'alice@example.com');
  });

  it('should login a user', async () => {
    await request(app)
      .post('/api/users/register')
      .send({
        name: 'Bob',
        email: 'bob@example.com',
        password: 'password123',
      });

    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'bob@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Login successful');
    expect(res.body).toHaveProperty('token');
  });

  it('should fail login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'bob@example.com',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Invalid email or password');
  });
});
