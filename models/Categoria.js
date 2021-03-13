const { DataTypes } = require('sequelize');

const sequelize = require('../database/connection')


const Categoria = sequelize.define('Categoria', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(30),
        unique: true
    }
}, {
    createdAt: true,
    updatedAt: false
});


module.exports = Categoria;