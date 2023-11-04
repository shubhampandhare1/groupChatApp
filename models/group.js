const Sequelize = require('sequelize');
const sequelize = require('../util/db');

const Group = sequelize.define('groups', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
    },
    uuid: {
        type: Sequelize.STRING,
    }
})

const Admin = sequelize.define('admins', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    }
})

module.exports = { Group, Admin }