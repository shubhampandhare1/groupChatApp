const Sequelize = require('sequelize');
const sequelize = require('../util/db');

const Archivedchats = sequelize.define('archivedchats', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    msg: Sequelize.STRING,
})

module.exports = Archivedchats;