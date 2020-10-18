require('./config/config')
const express = require('express')
const mongoose = require('mongoose');

var bodyParser = require('body-parser')
const app = express()


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/index'))



mongoose.connect(process.env.URLDB,{useNewUrlParser: true, useUnifiedTopology: true}, (err,res) => {
  //mongodb+srv://rolando:rolando123@cluster0.i9h1x.mongodb.net/cafe?retryWrites=true&w=majority
  //mongodb://localhost:27017/cafe
  if (err) throw err;
  console.log(`Conectado a Mongo!! `);

});
app.listen(process.env.PORT,()=> {
    console.log(`Escuchando en el puerto ${process.env.PORT} `);
})