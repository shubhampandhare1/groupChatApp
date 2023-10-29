const express = require('express');

const router = express.Router();
const userController = require('../controller/user');
const userAuth = require('../middleware/auth');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/sendmessage', userAuth, userController.sendmessage);
router.get('/getmessage', userAuth, userController.getmessage);

module.exports = router;