const express = require('express');
const ProductManager = require('./productManager')

const app = express();

const productManager = new ProductManager ();


(async () => {
    await productManager.readProductsFromFile();
  })();

app.get('/products', (req, res) =>{
    res.send(productManager.getProducts()) //respnde a la peticion con el contenido
});


app.listen(8080,() => console.log('Servidor arriba en el puerto 8080'))