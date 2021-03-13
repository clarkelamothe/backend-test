const Post = require('../models/Post');
const Categoria = require('../models/Categoria');

// Post.hasOne(Categoria);
Post.belongsTo(Categoria, {
    as: 'categoria',
    foreignKey: 'categoriaId'
});




