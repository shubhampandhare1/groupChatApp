const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/db');

const app = express();
app.use(bodyParser.json({ extended: false }));
app.use(cors({
    origin: 'http://127.0.0.1:3001',
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
}));

//models
const { User, Usergroup } = require('./models/user');
const Group = require('./models/group');
const Message = require('./models/message');

//routes
const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message');
const groupRoutes = require('./routes/group');


app.use('/user', userRoutes);
app.use('/user', messageRoutes);
app.use('/user', groupRoutes);


User.hasMany(Message);
Message.belongsTo(User);

User.belongsToMany(Group, { through: Usergroup });
Group.belongsToMany(User, { through: Usergroup });

Group.hasMany(Message);
Message.belongsTo(Group);

sequelize.sync()
    .then(() => {
        app.listen(3000)
    })
    .catch(err => {
        console.log('error at sequelize', err)
    })