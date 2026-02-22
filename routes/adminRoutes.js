const express = require('express');
const router = express.Router();

const verifyJWT = require('../middleware/auth.middleware');
const adminController = require('../controllers/adminController');

router.post('/login', adminController.login);

router.get('/', verifyJWT, adminController.getProtectedData);

module.exports = router;
