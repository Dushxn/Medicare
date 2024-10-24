const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const MedicalRecordRoutes = require('../routes/MedicalRecordRoutes');
const { MongoMemoryServer } = require('mongodb-memory-server');
const MedicalRecord = require('../models/MedicalRecord');

const app = express();
app.use(express.json());
app.use('/medicalrecords', MedicalRecordRoutes);

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

describe('MedicalRecord API', () => {

    // Cleanup after each test
    afterEach(async () => {
        await MedicalRecord.deleteMany({});
    });

    // Test case for creating a medical record
    describe('POST /medicalrecords/create', () => {
        it('should create a new medical record', async () => {
            const medicalRecordData = {
                patientID: '12345',
                patientName: 'John Doe',
                condition: 'Fever',
                symptoms: 'High temperature, weakness',
                labTestResults: 'Blood test normal',
                treatments: 'Paracetamol',
                notes: 'Patient stable',
            };

            const response = await request(app)
                .post('/medicalrecords/create')
                .send(medicalRecordData);

            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('record');
            expect(response.body.record).toHaveProperty('patientID', '12345');
        });

        it('should return 500 if required fields are missing', async () => {
            const incompleteData = {
                patientID: '12345',
                // Missing other fields
            };

            const response = await request(app)
                .post('/medicalrecords/create')
                .send(incompleteData);

            expect(response.statusCode).toBe(500);
            expect(response.body).toHaveProperty('message');
        });
    });

    // Test case for retrieving all medical records
    describe('GET /medicalrecords/all', () => {
        it('should return all medical records', async () => {
            // Insert a sample record into the database
            const medicalRecordData = {
                patientID: '12345',
                patientName: 'John Doe',
                condition: 'Fever',
                symptoms: 'High temperature, weakness',
                labTestResults: 'Blood test normal',
                treatments: 'Paracetamol',
                notes: 'Patient stable',
            };

            await request(app).post('/medicalrecords/create').send(medicalRecordData);

            const response = await request(app).get('/medicalrecords/all');

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('records');
            expect(response.body.records.length).toBe(1);
            expect(response.body.records[0]).toHaveProperty('patientID', '12345');
        });

        it('should return an empty array if no records exist', async () => {
            const response = await request(app).get('/medicalrecords/all');

            expect(response.statusCode).toBe(200);
            expect(response.body.records.length).toBe(0);
        });
    });
});
