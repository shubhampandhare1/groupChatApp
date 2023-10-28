const User = require("../models/user");
const bcrypt = require('bcryptjs');
exports.signup = async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;
        if (!name || !email || !mobile || !password) {
            return res.status(400).json({ message: 'All Fields Are Required' });
        }
        const userExists = await User.findOne({ where: { email } })
        if(userExists){
            return res.status(409).json({message:'User Already Exists'});
        }
        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                console.log('err at bcrypt', err)
            }
            await User.create({
                name: name,
                email: email,
                mobile: mobile,
                password: hash,
            })
        })
        res.status(201).json({ message: 'User Created Successfully' });
    }
    catch (error) {
        console.log('err at signup controller', error);
        res.status(500).json({ message: 'User Not Created', err: error })
    }
}