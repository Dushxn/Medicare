const bcrypt = require('bcryptjs');
const UserRepository = require('../repositories/UserRepository'); // Ensure this is correct
const jwt = require('jsonwebtoken');
require ('dotenv').config();

class UserService {
  constructor() {
    this.userRepository = new UserRepository(); // This should work if UserRepository is a class
  }

  async register(userData) {
    const { name, email,userType, password } = userData;
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    const user = await this.userRepository.createUser({ name, email,userType, password });
    return user;
  }

  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token, user };
  }
}

module.exports = new UserService(); // Export an instance of UserService
