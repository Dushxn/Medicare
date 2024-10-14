// repositories/HealthCardRepository.js
const HealthCard = require('../models/HealthCard');

const createHealthCard = async (data) => {
    try {
        const newCard = new HealthCard(data);
        return await newCard.save();
    } catch (error) {
        throw error;
    }
};

const getHealthCardByEmail = async (email) => {
    try {
        return await HealthCard.findOne({ email });
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createHealthCard,
    getHealthCardByEmail,
};
