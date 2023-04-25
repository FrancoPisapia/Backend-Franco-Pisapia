//const express = require('express');
//const ProductManager = require('./productManager')
//const productsRouter = require('./routes/products')

import {ProductManager,CartManager} from '../src/dao/fileSystem/Managers.js';
import express from 'express'
import productsRouter from './routes/products.js'
import cartsRouter from './routes/carts.js';
import chatRouter from './routes/chat.js';
import handlebars from 'express-handlebars';
import __dirname from './utils/handlebars.js';
import {Server} from 'socket.io';
import mongoose from "mongoose";


const app = express();

app.use(express.urlencoded({extended:true}))


const httpServer=app.listen(8080,() => console.log('Servidor arriba en el puerto 8080'));
const socketServer = new Server (httpServer);

//Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine', 'handlebars')
app.use(express.static(__dirname+'/public'))
app.use('/',chatRouter);


//Mongoose
mongoose.connect('mongodb+srv://francopisapia405:uPTbiSDQYTlKc3wm@codercluster.xlmgp1b.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to database'))
  .catch((err) => console.log(`Error connecting to database: ${err}`));


//Routers
app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
// app.use('/api/chat',chatRouter);




// Websockets
socketServer.on('connection',socket =>{

    socket.on ('message', data =>{
        console.log(data)
    });
    
    socket.emit('soloUnUsuario', 'Mensaje recibido por el usuario');

    socketServer.emit('mensajeTodos','Mensaje para todos');

    socket.broadcast.emit('mensajeTodosMenosSocketActual','Mensaje que pueden leer todos menos el socket actual');

    socket.on('chatRoom1', (data) =>
    {
      console.log(data);

      socket.broadcast.emit('chatRoom1', data);
    });
  });

//******PARA EL CHAT ***** */
// let messages =[];
// socketServer.on('connection',socket =>{
//     console.log('Nuevo cliente conectado');

//     socket.on ('message', data =>{
//         messages.push(data);
//         socketServer.emit('messageLogs',messages)
//     });

//     socket.on('login', (user) => {
//         console.log(`El usuario ${user} se ha conectado`);
//         socket.user = user;
//         socket.emit('messageLogs', messages);
//         socket.broadcast.emit('userConnected', user);
//     });

// })

