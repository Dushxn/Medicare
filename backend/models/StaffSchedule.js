// models/StaffSchedule.js
const mongoose = require('mongoose');

const StaffScheduleSchema = new mongoose.Schema({
    staffID: {
        type: String,
        required: true,
    },
    staffName: {
        type: String,
        required: true,
    },
    shift: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('StaffSchedule', StaffScheduleSchema);
