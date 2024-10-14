const User = require('../models/User'); // Import your User model

class UserRepository {
  async findByEmail(email) {
    return User.findOne({ email }); // Assuming you have a User model
  }

  async createUser(userData) {
    const user = new User(userData);
    await user.save();
    return user;
  }
}

module.exports = UserRepository; // Export the class
