//const express = require('express');
//const ProductManager = require('./productManager')
//const productsRouter = require('./routes/products')

import {ProductManager,CartManager} from '../src/Managers.js';
import express from 'express'
import productsRouter from './routes/products.js'
import cartsRouter from './routes/carts.js'

const app = express();

app.use(express.urlencoded({extended:true}))


app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


app.listen(8080,() => console.log('Servidor arriba en el puerto 8080'))