const express = require('express');
const Categoria = require('../models/categoria');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const categoria = require('../models/categoria');
const app = express();

app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario','nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                categorias
            })
        });
});
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id)
        .populate('usuario','nombre email')
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categoriaDB
            });
        })
});
app.post('/categoria', verificaToken, (req, res) => {
    let descripcion = req.body.descripcion;
    let id = req.usuario._id;
    let categoria = new Categoria({
        descripcion: descripcion,
        usuario: id
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});
app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let categoria = req.body;
    let categoriaUpdate = {
        descripcion: categoria.descripcion
    }
    Categoria.findByIdAndUpdate(id, categoriaUpdate, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

})
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndDelete(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                categoria: categoriaBorrada
            })
        }
        res.json({
            ok: true,
            categoria: categoriaBorrada
        })
    })
})

module.exports = app;