const router = require('express').Router();

const uploadController = require('../controller/upload.controller');
const uploadImage = require('../middleware/upload');
const auth = require('../middleware/auth')

router.post('/upload_avatar', uploadImage, auth, uploadController.uploadAvatar);

module.exports = router;