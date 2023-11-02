const Group = require('../models/group');
const { User, Usergroup } = require('../models/user');
const Sequelize = require('sequelize');

exports.createGroup = async (req, res) => {
    try {
        const groupName = req.body.groupName;

        const group = await req.user.createGroup({
            name: groupName,
        })
        res.status(201).json({ success: true, message: 'group created', group: group })
    } catch (error) {
        console.log('err at create group controller', error);
        res.status(500).json({ success: false, err: error })
    }
}

exports.getGroups = async (req, res) => {
    try {
        const userGroups = await Usergroup.findAll({
            where: { userId: req.user.id }
        })
        if (userGroups.length > 0) {
            const groups = await Group.findAll({
                include: [{
                    model: User,
                    where: { id: req.user.id },
                    through: { attributes: [] }
                }]
            })
            res.status(200).json({ success: true, groups: groups })
        }
    }
    catch (error) {
        console.log('error at getgroups', error);
        res.status(500).json({ success: false, message: 'error at getgroups' })
    }
}

exports.addUsertoGroup = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const email = req.body.email;
        
        const user = await User.findOne({ where: { email: email } });
        const group = await Group.findByPk(groupId);
        await user.addGroup(group);
        res.status(200).json({ success: true })
    }
    catch (error) {
        console.log('err at add user to group', error)
        res.status(500).json({ success: false });
    }
}