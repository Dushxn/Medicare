const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const HealthCardRoutes = require('../routes/HealthCardRoutes');
const { MongoMemoryServer } = require('mongodb-memory-server');
const HealthCard = require('../models/HealthCard');

const app = express();
app.use(express.json());
app.use('/healthcard', HealthCardRoutes);

let mongoServer;

// Setup in-memory MongoDB
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Cleanup after tests
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('HealthCard API', () => {
    
    // Cleanup after each test
    afterEach(async () => {
        await HealthCard.deleteMany({});
    });

    // Test case for health card registration
    describe('POST /healthcard/register', () => {
        it('should create a new health card', async () => {
            const healthCardData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'johndoe@example.com',
                NIC: '123456789V',
                gender: 'Male',
                contactNo: '0771234567',
            };

            const response = await request(app)
                .post('/healthcard/register')
                .send(healthCardData);

            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('healthCard');
            expect(response.body.healthCard).toHaveProperty('email', 'johndoe@example.com');
        });

        it('should return 400 if required fields are missing', async () => {
            const incompleteData = {
                firstName: 'John',
                lastName: 'Doe',
                // Missing email, NIC, gender, and contactNo
            };

            const response = await request(app)
                .post('/healthcard/register')
                .send(incompleteData);

            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('message', 'All fields are required');
        });

        it('should return 500 if there is a server error (duplicate email)', async () => {
            const healthCardData = {
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'janedoe@example.com',
                NIC: '123456789V',
                gender: 'Female',
                contactNo: '0779876543',
            };

            // Create first record
            await request(app).post('/healthcard/register').send(healthCardData);

            // Try creating a duplicate health card with the same email
            const response = await request(app)
                .post('/healthcard/register')
                .send(healthCardData);

            expect(response.statusCode).toBe(500);
            expect(response.body).toHaveProperty('message');
        });
    });

    // Test case for fetching health card details
    describe('GET /healthcard/details/:email', () => {
        it('should return health card details for a valid email', async () => {
            const healthCardData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'johndoe@example.com',
                NIC: '123456789V',
                gender: 'Male',
                contactNo: '0771234567',
            };

            // Create health card
            await request(app).post('/healthcard/register').send(healthCardData);

            // Fetch health card details
            const response = await request(app).get(`/healthcard/details/johndoe@example.com`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('healthCard');
            expect(response.body.healthCard).toHaveProperty('email', 'johndoe@example.com');
        });

        it('should return 404 if health card is not found', async () => {
            const response = await request(app).get('/healthcard/details/nonexistent@example.com');

            expect(response.statusCode).toBe(404);
            expect(response.body).toHaveProperty('message', 'Health card not ');
        });
    });
});
