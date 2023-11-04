const Sib = require('sib-api-v3-sdk');
const uuid = require('uuid');
const Forgotpass = require('../models/forgotpass');
const { User } = require('../models/user');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

exports.forgotPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ where: { email: email } });

        if (user) {

            const id = uuid.v4();
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>', id)

            Forgotpass.create({ id, userId: user.id, isActive: true })
                .then(res => console.log('Create Frogot Password Successful'))
                .catch(error => console.log('error at create forgot password', error))

            const client = Sib.ApiClient.instance;
            const apiKey = client.authentications['api-key'];
            apiKey.apiKey = process.env.SIB_API_KEY;
            const tranEmailApi = new Sib.TransactionalEmailsApi();

            const sender = {
                email: 'sde.shubham1997@gmail.com',
                name: 'Shubham from Group Chat App'
            }

            const receivers = [{
                email: req.body.email
            }]

            tranEmailApi.sendTransacEmail({
                sender,
                to: receivers,
                subject: 'Reset Password',
                htmlContent: `<h2>Reset Password</h2>
                <a href='http://localhost:3000/password/resetpassword/${id}'>Click Here</a> to reset password`
            })
                .then((result) => {
                    // console.log(result)
                    res.status(202).json({ success: true, message: 'Reset Password Link sent successfully' });
                })
                .catch((err) => {
                    throw new Error(err);
                })
        }
        else {
            throw new Error('User doesnt Exists');
        }
    } catch (error) {
        res.status(500).json({ err: error, message: 'error at resetPassword Controller' })
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const id = req.params.id;

        const forgtoPassReq = await Forgotpass.findOne({ where: { id: id } });
        
        if (forgtoPassReq.isActive) {
            forgtoPassReq.update({ isActive: false });
            const filePath = path.join(__dirname, '../public/password/resetPassword.html');
            const htmlContent = fs.readFileSync(filePath, 'utf-8');
            const updatedHtmlContent = htmlContent.replace('<%= id %>', `${id}`);

            res.status(200).send(updatedHtmlContent);
        }
        else {
            console.log('isActive === false')
        }
    } catch (error) {
        res.json({ err: error, message: 'reset password controller failed' })
    }
}

exports.updatePassword = async (req, res) => {
    try {
        const id = req.params.id;
        const newPassword = req.body.newPass;

        const resetPassword = await Forgotpass.findOne({ where: { id: id } });
        const user = await User.findOne({ where: { id: resetPassword.userId } });
        if (user) {
            const hashPass = await bcrypt.hash(newPassword, 10);
            await user.update({ password: hashPass });
            return res.status(200).json({ message: 'Password Updated Successfully' })
        }
        else {
            return res.satus(404).json({ message: 'User Not Found' })
        }
    } catch (error) {
        res.status(500).json({ err: error, message: 'err at updated password' })
    }
}