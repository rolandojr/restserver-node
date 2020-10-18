const express = require('express')
let Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const {verificaToken,verificaAdmin_Role} = require('../middlewares/autenticacion');
const _ = require('underscore');

const app = express()

app.get('/usuario',verificaToken,  (req, res) => {

    let desde = req.query.desde || 0 
    desde = Number(desde);

    let limite = req.query.limite || 5
    limite = Number(limite);


    Usuario.find({estado:true})
            .skip(desde)
            .limit(5)
            .exec((err,usuarios)=> {
                if (err) 
                    return  res.status(400).json({
                            ok: false,
                            err
                        })
                    
                 Usuario.count({estado:true},(error,count)=>{
                    if (err) {
                        return  res.status(500).json({
                            ok: false,
                            error
                        })
                    } 
                    res.json({
                        ok:true,
                        usuarios,
                        conteo:count
                        });     
                 })       
                      
            })
})
app.post('/usuario',[verificaToken,verificaAdmin_Role], function (req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre:body.nombre,
        email:body.email,
        password:bcrypt.hashSync(body.password,10),
        role:body.role
    })
    
    usuario.save((err,user)=>{
        if (err){
            return  res.status(400).json({
                ok: false,
                err
            })
        }
        user.password=null;
        res.json({
            ok:true,
            usuario: user
        }); 
    })
    
})
app.put('/usuario/:id',[verificaToken,verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body,['nombre','email','img','role','estado']);
    Usuario.findByIdAndUpdate(id,body,{new:true, runValidators:true,context: 'query'} ,(err,usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok:false,
                err
            })
        }
        res.json({
            ok:true,
            usuario:usuarioDB
        })
    })
})
app.delete('/usuario/:id', [verificaToken,verificaAdmin_Role] ,  (req, res) => {
    let id = req.params.id;
    let body = {
        estado:false
    }
    Usuario.findByIdAndUpdate(id,body,{new:true, runValidators:true,context: 'query'},(err,usuarioDB)=> {
        if (err) {
            return res.status(400).json({
                ok:false,
                err
            })
        }
        
        res.json({
            ok:true,
            usuario:usuarioDB
        })
    })
    // Usuario.findOneAndDelete(id,(err,usuarioBorrado)=> {
    //     if (err) {
    //         return res.status(400).json({
    //             ok:false,
    //             err
    //         })
    //     }
    //     res.json({
    //         ok:true,
    //         usuario:usuarioBorrado
    //     })
    // })

})
module.exports = app;