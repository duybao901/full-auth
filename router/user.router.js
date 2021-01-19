const express = require('express');
const router = express.Router();

const userController = require('../controller/user.controller');

router.post('/register', userController.register);
router.post('/activation_email', userController.activationEmail);

module.exports = router;