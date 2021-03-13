const { DataTypes } = require('sequelize');

const sequelize = require('../database/connection');



const Post = sequelize.define('Post', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: DataTypes.STRING(30),
        unique: true
    },
    contenido: {
        type: DataTypes.TEXT
    },
}, {
    timestamps: true,
    createdAt: true,
    updatedAt: false
});
module.exports = Post;