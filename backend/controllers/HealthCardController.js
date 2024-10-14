// controllers/HealthCardController.js
const HealthCardRepository = require('../repositories/HealthCardRepository');

const registerHealthCard = async (req, res) => {
    try {
        const { firstName, lastName, email, NIC, gender, contactNo } = req.body;

        // Simple validation
        if (!firstName || !lastName || !email || !NIC || !gender || !contactNo) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create a new health card
        const healthCard = await HealthCardRepository.createHealthCard({
            firstName,
            lastName,
            email,
            NIC,
            gender,
            contactNo,
        });

        return res.status(201).json({ message: 'Health card registered successfully', healthCard });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    registerHealthCard,
};
