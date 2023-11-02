const express = require('express');

const router = express.Router();
const groupController = require('../controller/group');
const userAuth = require('../middleware/auth');

router.post('/creategroup', userAuth, groupController.createGroup);
router.get('/getgroups', userAuth, groupController.getGroups);
router.post('/addtogroup/:groupId', userAuth, groupController.addUsertoGroup);

module.exports = router;