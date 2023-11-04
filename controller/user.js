const { User, Message, Group, Usergroup } = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const { Admin } = require('../models/group');

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

exports.getAllUsers = async (req, res) => {
    try {

        const users = await User.findAll({
            attributes: ['id', 'name', 'email']
        });

        const userGroups = await Usergroup.findAll({
            attributes: ['userId', 'groupId']
        })

        res.status(200).json({ user: users, userGroup: userGroups })
    }
    catch (error) {
        res.status(500).json({ err: error, message: 'Error occured at getAllUsers' })
    }
}