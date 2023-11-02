const Sequelize = require('sequelize');
const sequelize = require('../util/db');

const Message = sequelize.define('messages', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },

    msg: Sequelize.STRING,
    name: Sequelize.STRING,
})

module.exports = Message;