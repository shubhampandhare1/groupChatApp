const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/db');
const path = require('path');
const socketIo = require('socket.io');
const http = require('http');

const app = express();

const server = http.createServer(app);

const io = socketIo(server);

app.use(bodyParser.json({ extended: false }));
app.use(cors({
    origin: 'http://localhost:3000',
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


sequelize.sync()
    .then(() => {
        server.listen(3000)
    })
    .catch(err => {
        console.log('error at sequelize', err)
    })