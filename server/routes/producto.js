const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion')
const app = express();
let Producto = require('../models/producto');

app.get('/productos', verificaToken, (req, res) => {

    Producto.find({ disponible: true })
        .populate('usuario')
        .populate('categoria', 'descripcion')
        .exec((err, productosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            Producto.count({ disponible: true }, (err, cantidad) => {

                res.json({
                    ok: true,
                    productosDB,
                    cantidad
                })
            })

        })

})
app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                producto: productoDB
            })
        })
})
//=========================================================
//  Buscar producto por termino
//=========================================================

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino,'i');
    Producto.find({ nombre: regex })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                productos,
            });
        });
});

app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;
    let usuarioId = req.usuario._id;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.idCategoria,
        usuario: usuarioId
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    })

})
app.put('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;
    let productoActualizado = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion
    }

    Producto.findByIdAndUpdate(id, productoActualizado, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    }).populate('usuario')
        .populate('categoria')


})
app.delete('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let disponibilidad = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, disponibilidad, { new: true, runValidators: true, context: 'query' }, (err, productoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            producto: productoBorrado
        })
    })

})

module.exports = app;