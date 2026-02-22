const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// Create a user
router.post('/', userController.createUser);

// Get users
router.get('/', userController.getUsers);

module.exports = router;
