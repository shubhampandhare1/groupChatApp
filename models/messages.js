const Sequelize = require('sequelize');
const sequelize = require("../util/db");

const Message = sequelize.define('messages', {
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    
    msg: Sequelize.STRING,

    userId:{
        type: Sequelize.INTEGER,
    }
})

module.exports = Message;
