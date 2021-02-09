const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const authAdmin = require('../middleware/authAdmin');

const userController = require('../controller/user.controller');

router.post('/register', userController.register);

router.post('/login', userController.login)

router.post('/activation_email', userController.activationEmail);

router.get('/refresh_token', userController.getAccessToken);

router.post('/forgot', userController.forgotPassword);

router.post('/reset', auth, userController.resetPassword);

router.get('/infor', auth, userController.getUserInfor);

router.get('/all_infor', auth, authAdmin, userController.getAllUserInfor);

router.get('/logout', userController.logout);

router.post('/update', auth, userController.updateUserInfor);

router.patch('/update_role/:id', auth, authAdmin, userController.updateUserRole);

router.delete('/delete/:id', auth, authAdmin,userController.deleteUser)
 

module.exports = router;