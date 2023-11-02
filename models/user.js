const Sequelize = require('sequelize');
const sequelize = require('../util/db');
const Group = require('./group');

const User = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    mobile: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
})

const Usergroup = sequelize.define('usergroups', {
    userId: {
        type: Sequelize.INTEGER,
        refernces: {
            model: User,
            key: 'id',
        }
    },
    groupId: {
        type:Sequelize.INTEGER,
        refernces: {
            model: Group,
            key: 'id',
        }
    }
})

module.exports = { User, Usergroup }