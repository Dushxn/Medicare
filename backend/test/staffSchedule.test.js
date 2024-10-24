const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const StaffScheduleRoutes = require('../routes/StaffScheduleRoutes');
const { MongoMemoryServer } = require('mongodb-memory-server');
const StaffSchedule = require('../models/StaffSchedule');

const app = express();
app.use(express.json());
app.use('/staffschedules', StaffScheduleRoutes);

let mongoServer;

// Setup in-memory MongoDB
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Cleanup after all tests
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

// Cleanup after each test
afterEach(async () => {
    await StaffSchedule.deleteMany({});
});

describe('StaffSchedule API', () => {

    // Test case for creating a staff schedule
    describe('POST /staffschedules/create', () => {
        it('should create a new staff schedule', async () => {
            const staffScheduleData = {
                staffID: 'S001',
                staffName: 'Alice Johnson',
                shift: 'Morning',
                position: 'Nurse',
                department: 'Pediatrics',
            };

            const response = await request(app)
                .post('/staffschedules/create')
                .send(staffScheduleData);

            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('schedule');
            expect(response.body.schedule).toHaveProperty('staffID', 'S001');
            expect(response.body.schedule).toHaveProperty('staffName', 'Alice Johnson');
        });

        it('should return 500 if required fields are missing', async () => {
            const incompleteData = {
                staffID: 'S001',
                // Missing other fields
            };

            const response = await request(app)
                .post('/staffschedules/create')
                .send(incompleteData);

            expect(response.statusCode).toBe(500);
            expect(response.body).toHaveProperty('message');
        });
    });

    // Test case for retrieving all staff schedules
    describe('GET /staffschedules/all', () => {
        it('should return all staff schedules', async () => {
            const staffScheduleData = {
                staffID: 'S001',
                staffName: 'Alice Johnson',
                shift: 'Morning',
                position: 'Nurse',
                department: 'Pediatrics',
            };

            await request(app).post('/staffschedules/create').send(staffScheduleData);

            const response = await request(app).get('/staffschedules/all');

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('schedules');
            expect(response.body.schedules.length).toBe(1);
            expect(response.body.schedules[0]).toHaveProperty('staffID', 'S001');
        });

        it('should return an empty array if no schedules exist', async () => {
            const response = await request(app).get('/staffschedules/all');

            expect(response.statusCode).toBe(200);
            expect(response.body.schedules.length).toBe(0);
        });
    });

    // Test case for updating a staff schedule
    describe('PUT /staffschedules/update/:id', () => {
        it('should update an existing staff schedule', async () => {
            const staffScheduleData = {
                staffID: 'S001',
                staffName: 'Alice Johnson',
                shift: 'Morning',
                position: 'Nurse',
                department: 'Pediatrics',
            };

            // Create a staff schedule
            const createResponse = await request(app).post('/staffschedules/create').send(staffScheduleData);
            const scheduleId = createResponse.body.schedule._id;

            // Update the staff schedule
            const updateData = { shift: 'Evening' };
            const updateResponse = await request(app)
                .put(`/staffschedules/update/${scheduleId}`)
                .send(updateData);

            expect(updateResponse.statusCode).toBe(200);
            expect(updateResponse.body.schedule).toHaveProperty('shift', 'Evening');
        });

        it('should return 404 if the schedule is not found', async () => {
            const invalidId = new mongoose.Types.ObjectId(); // Add 'new' keyword to instantiate ObjectId

            const updateData = { shift: 'Evening' };
            const response = await request(app).put(`/staffschedules/update/${invalidId}`).send(updateData);

            expect(response.statusCode).toBe(404);
            expect(response.body).toHaveProperty('message', 'Schedule not ');
        });
    });
});
