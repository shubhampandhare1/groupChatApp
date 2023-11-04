const express = require('express');

const router = express.Router();
const userController = require('../controller/user');
const userAuth = require('../middleware/auth');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/getallusers/:groupId', userAuth, userController.getAllUsers);

module.exports = router;