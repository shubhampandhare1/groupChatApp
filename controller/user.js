const User = require('../models/user');
const Message = require('../models/messages');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;
        if (!name || !email || !mobile || !password) {
            return res.status(400).json({ message: 'All Fields Are Required' });
        }
        const userExists = await User.findOne({ where: { email } })
        if (userExists) {
            return res.status(409).json({ message: 'User Already Exists, Please Login' });
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
        res.status(201).json({ message: 'Successfully Signed Up' });
    }
    catch (error) {
        console.log('err at signup controller', error);
        res.status(500).json({ message: 'User Not Created', err: error })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.staus(400).json({ message: 'All Fields Are Required' })
        }
        const userExists = await User.findAll({ where: { email } });
        if (userExists.length > 0) {
            bcrypt.compare(password, userExists[0].password, (err, result) => {
                if (err) {
                    console.log('error at bcrypt compare', err)
                }
                if (result === true) {
                    res.status(200).json({ message: 'User Login Successful', token: generateAccessToken(userExists[0].id, userExists[0].name) })
                }
                else {
                    res.status(401).json({ message: 'User not authorized' });
                }
            })
        }
        else {
            throw new Error('User Not Found');
        }
    } catch (error) {
        res.status(404).json({ success: false, message: 'User Not Found' })
    }
}

const generateAccessToken = (id, name) => {
    return jwt.sign({ userId: id, name: name }, process.env.SECRET_KEY);
}

exports.sendmessage = async (req, res) => {
    try {
        const msg = req.body.msg;

        await Message.create({
            msg: msg,
            userId: req.user.id,
            name: req.user.name,
        })

        res.status(201).json({ success: true, message: 'Message saved in DB' })

    } catch (error) {
        console.log(err);
        res.staus(500).json({ success: false, err: error })
    }
}

exports.getmessage = async (req, res) => {
    try {
        const message = await Message.findAll();
        res.status(200).json({message: message})
    } catch (error) {
        res.status(500).json({success:false, message:'Something Went Wrong in getmessage'})
    }
}