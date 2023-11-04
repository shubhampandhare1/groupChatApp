const express = require('express');

const router = express.Router();
const groupController = require('../controller/group');
const userAuth = require('../middleware/auth');

router.post('/creategroup', userAuth, groupController.createGroup);
router.get('/getgroups', userAuth, groupController.getGroups);
router.post('/addtogroup/:groupId', userAuth, groupController.addUsertoGroup);
router.post('/removeuser/:groupId', userAuth, groupController.removeUserFromGroup);
router.post('/makeadmin/:groupId', userAuth, groupController.makeAdmin);
router.get('/getadmins', userAuth, groupController.getAdmin);
router.get('/isgroupmember', userAuth, groupController.isGroupMember);
router.post('/removeadmin', userAuth, groupController.removeAdmin);

module.exports = router;