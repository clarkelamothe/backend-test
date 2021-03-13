const express = require('express');

const sequelize = require('./database/connection');
const Post = require('./models/Post');
const Categoria = require('./models/Categoria');
require('./models/asociations');

const app = express();
app.use(express.json());


// Crear un nuevo post para una categoria
//
// Ejemplo test  post -  localhost:3001/post
//   {
//     "titulo":"Vivir sin miedo",
//     "contenido":" contenido de vivir sin miero",
//     "categoria":"vida"
//    }

app.post('/post', async (req, res) => {
    try {
        // se verifica los datos de entrada
        if (!req.body.titulo || !req.body.contenido || !req.body.categoria) {
            throw new Error('No enviaste todo los datos');
        }

        // se verifica si existe una categoria
        const categoriaExiste = await Categoria.findOne({
            where: {
                nombre: req.body.categoria
            }
        })
        if (!categoriaExiste) {
            throw new Error('No existe tal categoria.')
        }

        // se verifica si ya existe un titulo porque debe ser unico
        const tituloExiste = await Post.findOne({
            where: {
                titulo: req.body.titulo
            }
        })
        if (tituloExiste) {
            throw new Error('El titulo ya existe.')
        }

        // se arma el paquete del Post 
        const nuevoPost = await Post.create({
            titulo: req.body.titulo,
            contenido: req.body.contenido,
            categoriaId: categoriaExiste.id
        })
        // response con un json 
        res.status(200).send({
            mensaje: "Post agregado perfectamente",
            data: nuevoPost
        })
    } catch (error) {
        res.status(413).send({
            mensaje: "Error al cargar el post",
            error: error.message
        })
    }
})



// modificar un post dada un id por parametro
//
// Ejemplo test put -  localhost:3001/post/3
//
//
app.put('/post/:id', async (req, res) => {
    try {
        // se verifica id de entrada
        if (!req.params.id) {
            throw new Error('Falta id del post')
        }

        // se verifica si existe el post a modificar
        const postExiste = await Post.findOne({
            where: {
                id: req.params.id
            }
        })
        if (!postExiste) {
            throw new Error('No existe un post con tal id')
        }

        // se verifica si existe un categoris en caso que si se modifica tambien
        const categoriaExiste = await Categoria.findOne({
            where: {
                nombre: req.body.categoria
            }
        })
        if (!categoriaExiste) {
            throw new Error('Categoria no existe.')
        }

        // se actualiza el paquete
        const postActualizado = await Post.update({
            contenido: req.body.contenido,
            categoriaId: categoriaExiste.id
        }, {
            where: {
                id: req.params.id
            }
        })

        // response con un json  un mensaje y el dato modificado
        res.status(200).send({
            mensaje: "Post actualizado perfectamente",
            data: {
                titulo: req.body.titulo,
                contenido: req.body.contenido,
                categoriaId: categoriaExiste.id
            }
        })

    } catch (error) {
        res.status(413).send({
            mensaje: "Error al actualizar el post",
            error: error.message
        })
    }
})



// borrar un post dada un id por parametro
//
// Ejemplo test  delete -  localhost:3001/post/3
//
//
app.delete('/post/:id', async (req, res) => {
    try {
        // se verifica el id de entrada
        if (!req.params.id) {
            throw new Error('Falta id del post')
        }
        // se verifica si existe un post con ese id
        const postExiste = await Post.findOne({
            where: {
                id: req.params.id
            }
        })
        if (!postExiste) {
            throw new Error('No existe un post con tal id')
        }

        // se borra el post 
        await Post.destroy({
            where: {
                id: req.params.id
            }
        });

        // response con mensaje de exito
        res.status(200).send({
            mensaje: "Post borrado perfectamente",
        })
    } catch (error) {
        res.status(413).send({
            mensaje: "Error al borrar el post",
            error: error.message
        })
    }
})


// traer todo los posts con informacion reducida
//
// Ejemplo test   get  -  localhost:3001/post
//
//

app.get('/post', async (req, res) => {
    try {
        const posts = await Post.findAll({
            attributes: ['id', 'titulo'],
            include: {
                attributes: ['nombre'],
                model: Categoria,
                as: "categoria",
            }
        })

        res.status(200).send({
            mensaje: "Encontrado.",
            data: posts
        })
    } catch (error) {
        res.status(413).send({
            mensaje: 'Error',
            error: error.message
        })
    }
})



// traer informacion de un post segun id por parametro
//
// Ejemplo test   get -  localhost:3001/post/3
//
//

app.get('/post/:id', async (req, res) => {
    try {
        // se verifica el id entrante
        if (!req.params.id) {
            throw new Error('No enviaste un id')
        }

        // se busca en la db el post del id
        const postExiste = await Post.findOne({
            attributes: ['id', 'titulo', 'contenido'],
            include: {
                attributes: ['nombre'],
                model: Categoria,
                as: 'categoria'
            },
            where: {
                id: req.params.id
            }
        })
        // se verifica si existe el post con el id
        if (!postExiste) {
            throw new Error('No existe un post con tal id')
        }

        res.status(200).send({
            mensaje: "Encontrado.",
            data: postExiste
        })
    } catch (error) {
        res.status(413).send({
            mensaje: "Error al buscar el id",
            error: error.message
        })
    }
})


// buscar todo los post de un categoria dada por parametro
//
// Ejemplo test    get -  localhost:3001/post/categoria/vida
//
//

app.get('/post/categoria/:categoria', async (req, res) => {
    try {
        // se verifica la categoria entrante
        if (!req.params.categoria) {
            throw new Error('No enviaste una categoria')
        }
        // se verifica si existe tal categoria 
        const categoriaExiste = await Categoria.findOne({
            where: {
                nombre: req.params.categoria
            }
        })
        if (!categoriaExiste) {
            throw new Error('No existe categoria')
        }

        const postSegunCategoria = await Post.findAll({
            attributes: ['id', 'titulo', 'contenido'],
            include: {
                attributes: ['nombre'],
                model: Categoria,
                as: 'categoria'
            },
            where: {
                categoriaId: categoriaExiste.id
            }
        })
        res.status(200).send({
            mensaje: "Encontrado.",
            data: postSegunCategoria
        })
    } catch (error) {
        res.status(413).send({
            mensaje: "Error al buscar los posts",
            error: error.message
        })
    }
})


// buscar todo los post de un categoria dada por parametro
//
// Ejemplo test    post -  localhost:3001/categoria
// {
//     "nombre": "vida"
// }
//

app.post('/categoria', async (req, res) => {
    try {
        if (!req.body.nombre) {
            throw new Error('No enviaste una categoria')
        }
        const categoriaExiste = await Categoria.findOne({
            where: {
                nombre: req.body.nombre
            }
        })

        if (categoriaExiste) {
            throw new Error('La categoria ya existe.')
        }

        const nuevaCategoria = await Categoria.create({
            nombre: req.body.nombre
        })
        res.status(200).send({
            mensaje: "Categoria agregada perfectamente",
            data: nuevaCategoria
        })
    } catch (error) {
        res.status(413).send({
            mensaje: "Error al cargar la categoria",
            error: error.message
        })
    }
})


const port = process.env.PORT ? process.env.PORT : 3001;



app.listen(port, async (req, res) => {
    console.log(`Servidor escuchando en: localhost:${port}`);
    try {
        await sequelize.authenticate();
        sequelize.sync({
            force: false,
        });
        console.log('Base de dataos conectada.');
    } catch (error) {
        console.error('Error al conectarse a la base de datos...', error);
    }
})