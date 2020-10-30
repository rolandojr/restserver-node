const express = require('express');
const fs = require('fs');
const path = require('path')
const  {verificaImgToken} = require('../middlewares/autenticacion');
const app = express();

app.get('/imagenes/:tipo/:img',verificaImgToken, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let imagePath = path.resolve(__dirname,`../../uploads/${tipo}/${img}`);
    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    }else{
        let noImagenPath = path.resolve(__dirname,'../assets/no-image.jpg');
        res.sendFile(noImagenPath);
    }
})

module.exports = app;