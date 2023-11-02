const Message = require('../models/message');
const Sequelize = require('sequelize');
const { Usergroup } = require('../models/user');


exports.sendmessage = async (req, res) => {
    try {
        const msg = req.body.msg;
        const groupId = req.params.groupId;

        await req.user.createMessage({
            msg: msg,
            name: req.user.name,
            groupId: groupId,
        })

        res.status(201).json({ success: true, message: 'Message saved in DB' })

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, err: error })
    }
}

exports.getmessage = async (req, res) => {
    try {
        const chatId = +req.query.chatId;
        const groupId = +req.query.groupId;
        const userGroups = await Usergroup.findAll({
            where: {
                userId: req.user.id,
                groupId: groupId,
            }
        })

        if (userGroups.length > 0) {
            const message = await Message.findAll({
                where: {
                    id: {
                        [Sequelize.Op.gt]: chatId
                    },
                    groupId: groupId,
                }
            });
            res.status(200).json({ message: message });
        }
        else{
            throw new Error('No groups associated with the user')
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Something Went Wrong in getmessage' })
    }
}