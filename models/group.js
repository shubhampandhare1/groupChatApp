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

module.exports = Group;