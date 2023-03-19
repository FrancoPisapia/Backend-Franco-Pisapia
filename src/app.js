const express = require('express');
const ProductManager = require('./productManager')

const app = express();
app.use(express.urlencoded({extended:true}))

const productManager = new ProductManager ();

  (async () => {
    await productManager.readProductsFromFile();
  })();


app.get('/products', (req, res) =>
{
    const products =productManager.getProducts()
    //const cantidadValores =parseInt(req.query.limit);
    const pQuantity = parseInt(req.query.q)
    //console.log(cantidadValores) //no me lo define

    if( Number.isNaN(pQuantity) || pQuantity >= products.length) 
    {
        return res.send (products)
    } else
    {
        let productosFiltrados = products.slice(0,pQuantity)
        res.send(productosFiltrados)
    }
});


app.get('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = productManager.getProductById(id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ error: 'Producto no encontrado' });
    }
  });




app.listen(8080,() => console.log('Servidor arriba en el puerto 8080'))