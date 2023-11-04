const { Group, Admin } = require('../models/group');
const { User, Usergroup } = require('../models/user');
const Sequelize = require('sequelize');

exports.createGroup = async (req, res) => {
    try {
        const groupName = req.body.groupName;
        const user = await User.findOne({ where: { id: req.user.id } });
        const group = await user.createGroup({
            name: groupName,
        })

        user.addGroup(group);

        const admin = await user.createAdmin({ isAdmin: true });

        await user.addAdmin(admin);

        await group.addAdmin(admin);

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
        const admin = await Admin.findOne({ where: { userId: req.user.id, groupId: groupId, isAdmin: true } });
        if (admin.isAdmin == true) {
            const user = await User.findOne({ where: { email: email } });
            const group = await Group.findByPk(groupId);
            await user.addGroup(group);
            res.status(200).json({ success: true })
        }
        else {
            throw new Error('only admin can add user');
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'only admin can add user' });
    }
}

exports.removeUserFromGroup = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const email = req.body.email;

        const admin = await Admin.findOne({ where: { userId: req.user.id, groupId: groupId, isAdmin: true } });
        const user = await User.findOne({ where: { email: email } });
        console.log('>>>>>>>>>>>>>>>>>>>>>>', admin);
        if (user.id == req.user.id || (admin.isAdmin == true)) {

            const group = await Group.findByPk(groupId);

            if (!user || !group) {
                throw new Error('User or Group Not Found');
            }

            const isUserAdmin = await Admin.findOne({
                where: {
                    groupId: groupId,
                    userId: user.id,
                }
            })

            if (isUserAdmin) {
                await Admin.destroy({
                    where: {
                        id: isUserAdmin.id
                    }
                })
            }

            await user.removeGroup(group);
            res.status(200).json({ success: true, message: 'user removed' })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ err: error, success: false, message: 'only admin can remove user' });
    }
}

exports.makeAdmin = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const email = req.body.email;

        const admin = await Admin.findOne({ where: { userId: req.user.id, groupId: groupId, isAdmin: true } });
        if (admin.isAdmin == true) {

            const user = await User.findOne({ where: { email: email } });
            const group = await Group.findByPk(groupId);

            await Admin.create({ userId: user.id, groupId: group.id, isAdmin: true });

            res.status(200).json({ success: true, message: 'You are Admin now' })
        }
        else {
            throw new Error('only admin have access');
        }
    }
    catch (error) {
        res.status(500).json({ err: error, success: false, message: 'only admin have access' });
    }
}

exports.getAdmin = async (req, res) => {
    try {
        const groupId = +req.query.groupId;
        const userId = +req.query.userId;
        const userGroup = await Usergroup.findOne({
            where: {
                userId: userId,
                groupId: groupId,
            }
        })

        const admins = await Admin.findAll({
            where: { groupId: groupId, isAdmin: true },
        })

        res.status(200).json({ admins, userGroup })
    }
    catch (error) {
        res.status(500).json({ err: error, message: 'Something wrong at getAdmin' })
    }
}

exports.isGroupMember = async (req, res) => {
    try {
        const userId = +req.query.userId;
        const groupId = +req.query.groupId;
        const userGroup = await Usergroup.findOne({
            where: {
                userId: userId,
                groupId: groupId,
            }
        })
        res.status(200).json({ userGroup });
    }
    catch (error) {
        res.status(500).json({ err: error, message: 'err at isGroupMember' })
    }
}

exports.removeAdmin = async (req, res) => {
    try {
        const groupId = +req.query.groupId;
        const userId = req.user.id;

        const admin = await Admin.findOne({ where: { userId: userId, groupId: groupId, isAdmin: true } });

        if (admin.isAdmin) {
            await Admin.destroy({ where: { userId: userId, groupId: groupId } })
            res.status(200).json({ message: 'Admin Removed' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ err: error, message: 'Only Admin Have This Access' })
    }
}