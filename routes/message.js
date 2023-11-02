const express = require('express');

const router = express.Router();
const messageController = require('../controller/message');
const userAuth = require('../middleware/auth');

router.post('/sendmessage/:groupId', userAuth, messageController.sendmessage);
router.get('/getmessage', userAuth, messageController.getmessage);

module.exports = router;