const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/db');
const path = require('path');
const socketIo = require('socket.io');
const http = require('http');
const fileUpload = require('express-fileupload');
const cron = require('node-cron');
const { Op } = require('sequelize');

const app = express();

const server = http.createServer(app);

const io = socketIo(server);

app.use(bodyParser.json({ extended: true }));
app.use(fileUpload());

app.use(cors({
    origin: 'http://16.171.64.230:3000',
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
}));

//models
const { User, Usergroup } = require('./models/user');
const { Group, Admin } = require('./models/group');
const Message = require('./models/message');

//routes
const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message');
const groupRoutes = require('./routes/group');
const passwordRoutes = require('./routes/forgotpass');
const Archivedchats = require('./models/archivedChats');


app.use('/user', userRoutes);
app.use('/user', messageRoutes);
app.use('/user', groupRoutes);
app.use('/password', passwordRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res) => {
    res.sendFile(path.join(__dirname, `${req.url}`));
})

User.hasMany(Message);
Message.belongsTo(User);

User.belongsToMany(Group, { through: Usergroup });
Group.belongsToMany(User, { through: Usergroup });

Group.hasMany(Message);
Message.belongsTo(Group);

User.hasMany(Admin);
Admin.belongsTo(User);
Group.hasMany(Admin);
Admin.belongsTo(Group);

io.on('connection', socket => {

    socket.on('send-message', (message) => {

        io.emit('receive-message', message);
    })

    socket.on('userAdded', () => {
        io.emit('userAdded');
    })

    socket.on('userRemoved', () => {
        io.emit('userRemoved');
    })

    socket.on('adminAdded', () => {
        io.emit('adminAdded');
    })

    socket.on('adminRemoved', () => {
        io.emit('adminRemoved');
    })
})


sequelize.sync({ alter: true })
    .then(() => {
        server.listen(3000)
    })
    .catch(err => {
        console.log('error at sequelize', err)
    })

cron.schedule('0 0 * * *', function () {

    const currDate = new Date();

    const checkDate = `${currDate.getFullYear()}-${(currDate.getMonth() + 1).toString().padStart(2, '0')}-${(currDate.getDate()).toString().padStart(2, '0')}`;

    Message.findAll({ where: { createdAt: { [Op.lt]: checkDate } } })
        .then((allChats) => {
            allChats.forEach((chat) => {
                Archivedchats.create(chat.toJSON());
                chat.destroy();
            })
        })
        .catch(err => console.log('err at cron', err))
})