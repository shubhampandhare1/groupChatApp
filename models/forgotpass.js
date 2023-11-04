const Sequelize = require('sequelize');
const sequelize = require('../util/db');

const Forgotpass = sequelize.define('forgotpass', {
    id:{
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
    },
    userId: Sequelize.INTEGER,
    isActive: Sequelize.BOOLEAN,
})

module.exports = Forgotpass;