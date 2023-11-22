const Message = require('../models/message');
const Sequelize = require('sequelize');
const { Usergroup } = require('../models/user');
const AWS = require('aws-sdk');
const { Group } = require('../models/group');


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
        else {
            throw new Error('No groups associated with the user')
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Something Went Wrong in getmessage' })
    }
}

exports.sendMedia = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const userId = req.user.id;
        const { files } = req;
        const file = files.media;
        if (!file) {
            console.log('no files found')
        }
        const groups = await req.user.getGroups({ where: { id: groupId } })

        if (groups) {
            let type;
            if (file.mimetype.startsWith('image')) {
                type = 'image';
            } else if (file.mimetype.startsWith('video')) {
                type = 'video';
            } else {
                type = 'other';
            }

            let name = file.name;
            const ext = name.slice(name.lastIndexOf('.') + 1);
            const filename = `Images/${userId}/${groupId}/${new Date()}.${ext}`;
            const fileUrl = await uploadToS3(file.data, filename);

            await req.user.createMessage({
                msg: fileUrl,
                name: req.user.name,
                groupId: groupId,
            })
            
            res.status(200).json({ success: true, message: 'media saved in db', fileUrl: fileUrl });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occured at media saving', err: error })
    }

}

function uploadToS3(data, filename) {
    let s3Bucket = new AWS.S3({
        accessKeyId: process.env.IAM_USER_KEY,
        secretAccessKey: process.env.IAM_USER_SECRET
    })

    let params = {
        Bucket: process.env.BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read',
    }

    return new Promise((res, rej) => {
        s3Bucket.upload(params, (err, s3response) => {
            if (err) {
                console.log('Something Went Wrong at s3 upload', err);
                rej(err);
            } else {
                res(s3response.Location);
            }
        })
    })
}