const express = require('express');
const router = express.Router();

const userController = require('../controller/user.controller');

router.post('/register', userController.register);
router.post('/login', userController.login)
router.post('/activation_email', userController.activationEmail);
router.get('/refresh_token', userController.getAccessToken);

module.exports = router;