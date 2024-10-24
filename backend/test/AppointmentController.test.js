const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const AppointmentRoutes = require('../routes/AppointmentRoutes');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = express();
app.use(express.json());
app.use('/appointment', AppointmentRoutes);

let mongoServer;

// test database setup
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('AppointmentController', () => {
    //create appointment test
    it('should create a new appointment', async () => {
        const response = await request(app).post('/appointment/create').send({
            patientName: 'John Doe',
            email: 'john.doe@example.com',
            contactNo: '1234567890',
            specialization: 'Dermatology',
            doctor: 'Dr. Smith',
            date: '2024-10-20',
            timeSlot: '10:00 AM - 11:00 AM',
            location: 'Clinic A'
        });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Appointment created successfully');
    });

    //reschedule appointment test
    it('should reschedule an existing appointment', async () => {
        const appointmentResponse = await request(app).post('/appointment/create').send({
            patientName: 'Jane Doe',
            email: 'jane.doe@example.com',
            contactNo: '0987654321',
            specialization: 'Cardiology',
            doctor: 'Dr. Green',
            date: '2024-10-21',
            timeSlot: '11:00 AM - 12:00 PM',
            location: 'Clinic B'
        });

        const rescheduleResponse = await request(app).put('/appointment/reschedule').send({
            appointmentId: appointmentResponse.body.appointment._id,
            date: '2024-10-22',
            timeSlot: '1:00 PM - 2:00 PM'
        });

        expect(rescheduleResponse.statusCode).toBe(200);
        expect(rescheduleResponse.body.message).toBe('Appointment rescheduled ');
    });

    //delete appointment test

    it('should delete an existing appointment', async () => {
        const appointmentResponse = await request(app).post('/appointment/create').send({
            patientName: 'Jake Doe',
            email: 'jake.doe@example.com',
            contactNo: '1029384756',
            specialization: 'Neurology',
            doctor: 'Dr. Brown',
            date: '2024-10-23',
            timeSlot: '9:00 AM - 10:00 AM',
            location: 'Clinic C'
        });

        const deleteResponse = await request(app).delete('/appointment/delete').send({
            appointmentId: appointmentResponse.body.appointment._id
        });

        expect(deleteResponse.statusCode).toBe(200);
        expect(deleteResponse.body.message).toBe('Appointment deleted successfully');
    });

    //get all appointments test

    it('should get all appointments', async () => {
        const response = await request(app).get('/appointment/all');
        expect(response.statusCode).toBe(200);
    });

    //get appointments by date test
    it('should group appointments by timeSlot', async () => {
        const response = await request(app).get('/appointment/time-slot-analysis');
        expect(response.statusCode).toBe(200);
    });
});
