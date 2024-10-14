const UserService = require('../Services/USerService');

class UserController {
  async register(req, res) {
    try {
      const user = await UserService.register(req.body);
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { token, user } = await UserService.login(req.body.email, req.body.password);
      res.json({ message: 'Login successful', token, user });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new UserController();
