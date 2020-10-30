const express = require('express');
const fileUpload = require('express-fileupload');
const usuario = require('../models/usuario');
const Usuario = require('../models/usuario')
const Producto = require('../models/producto');
const app = express();
const fs = require('fs');
const path = require('path')
// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({
                ok: false,
                message: 'No se ha seleccionado ningun archivo'
            });
    }
    let tiposValidos = ['productos', 'usuarios'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Debe subir la imagen en alguno de estos tipos: ' + tiposValidos.toString()
            }
        })
    }
    let extensionesValidas = ['jpg', 'png', 'gif', 'jpeg'];

    let archivo = req.files.archivo;
    let nombreArchivo = archivo.name;
    let nombreSeparado = nombreArchivo.split('.');
    let extension = nombreSeparado[nombreSeparado.length - 1];
    

    if (!extensionesValidas.includes(extension)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Debe subir archivos con la extension ' + extensionesValidas.toString(),
                ext: extension
            }
        })
    }

    let nombreArchivoExtendido = `${id}-${new Date().getMilliseconds()}.${extension}`;
    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivoExtendido}`, function (err) {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            })
        if (tipo === 'usuarios') {
            
            actualizarImagenUsuario(id,res, nombreArchivoExtendido)
        }else{
            actualizarImagenProductos(id,res,nombreArchivoExtendido);
        }
    });
});

function actualizarImagenProductos(id,res,img) {

    Producto.findById(id,(err,productoDB) => {
        if (err) {
            borrarImagen(img,'productos');
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            borrarImagen(img,'productos');
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            })
        }
        borrarImagen(productoDB.img,'productos');
        productoDB.img = img;
        productoDB.save((err, productoGuardado) => {

            res.json({
                ok: true,
                producto: productoGuardado,
                img
            });
        });
    });

}

function actualizarImagenUsuario(id, res, img) {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err){
            borrarImagen(img,'usuarios');
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!usuarioDB) {
            borrarImagen(img,'usuarios');
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }
        
        borrarImagen(usuarioDB.img,'usuarios');

       
        usuarioDB.img = img;
        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img
            })
        })
    })
}
function borrarImagen (imagen,tipo) {

    let pathImagen = path.resolve(__dirname,`../../uploads/${tipo}/${imagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;