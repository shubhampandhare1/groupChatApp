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
const User = require('./models/user');
const Message = require('./models/messages');

//routes
const userRoutes = require('./routes/user');


app.use('/user', userRoutes);


User.hasMany(Message);
Message.belongsTo(User);


sequelize.sync()
    .then(() => {
        app.listen(3000)
    })
    .catch(err => {
        console.log('error at sequelize', err)
    })