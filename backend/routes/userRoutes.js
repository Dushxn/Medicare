const express = require('express');
const UserController = require('../controllers/UserController');
const router = express.Router();

router.post('/register', (req, res) => UserController.register(req, res));
router.post('/login', (req, res) => UserController.login(req, res));

module.exports = router;
