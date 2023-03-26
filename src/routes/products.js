
import {ProductManager} from '../productManager.js';
import express from 'express'
import uploader from '../utils.js'


const app = express();
const router = express.Router(); 
app.use(express.urlencoded({extended:true}))

const productManager = new ProductManager ();


  (async () => {
    await productManager.readProductsFromFile();
  })();

  router.get('/', (req, res) =>
  {
      const products =productManager.getProducts()
      //const cantidadValores =parseInt(req.query.limit);
      const limit = parseInt(req.query.limit)
      //console.log(cantidadValores) //no me lo define
  
      if( Number.isNaN(limit) || limit >= products.length) 
      {
          return res.send (products)
      } else
      {
          let productosFiltrados = products.slice(0,limit)
          res.send(productosFiltrados)
      }
  });


  router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = productManager.getProductById(id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ error: 'Producto no encontrado' });
    }
  });

    router.post('/',(req,res)=>{
      const products =productManager.getProducts()
      const newProduct = req.body;
      const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
      const missingFields = requiredFields.filter((field) => !newProduct[field]);

      if (missingFields.length > 0) {
        return res.status(400).json({ error: `Faltan los siguientes campos obligatorios: ${missingFields}` });
        
      }

      newProduct.status = newProduct.status ?? true;

      const productId = productManager.addProduct(newProduct);
      let index = productId-1

      //productManager.addProduct(newProduct);
      products[index].id = productId
      //products.push(newProduct) //Con esto hace el 4
      res.status(201).json( products );
    })

  export default router