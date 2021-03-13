const { Sequelize } = require('sequelize');
const { database } = require('../db_config');


const sequelize = new Sequelize(database.database, database.username, database.password, {
    host: database.host,
    dialect: database.dialect,
    port: database.port
})

module.exports = sequelize;