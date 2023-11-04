const express = require('express');

const router = express.Router();
const controller = require('../controller/forgotpass');

router.post('/forgotpassword', controller.forgotPassword);
router.get('/resetpassword/:id', controller.resetPassword);
router.post('/updatepassword/:id', controller.updatePassword);

module.exports = router;