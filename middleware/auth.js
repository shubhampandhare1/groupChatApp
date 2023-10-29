const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = async (req, res, next) => {

    try {

        const token = req.header("Authorization");
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findByPk(decode.userId);
        req.user = user;
        next();

    } 
    catch (error) {
        res.status(401).json({ success: false, message: 'User Not Authorized' });
    }
}

module.exports = authenticate;