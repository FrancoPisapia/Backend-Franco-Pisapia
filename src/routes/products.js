import {ProductManager} from '../Managers.js';
import express from 'express'
import uploader from '../utils/multer.js'


const app = express();
const routerProduct = express.Router(); 
app.use(express.urlencoded({extended:true}))

const productManager = new ProductManager ();


(async () => {
  await productManager.readProductsFromFile();
})();

routerProduct.get('/', (req, res) =>
  {
    const products =productManager.getProducts()
 
    const limit = parseInt(req.query.limit)

    if( Number.isNaN(limit) || limit >= products.length) 
    {
      return res.send (products)
    } 
    else
    {
      let productosFiltrados = products.slice(0,limit)
      res.status(200).send(productosFiltrados)
    }
});


routerProduct.get('/:id', (req, res) => 
{
  const id = parseInt(req.params.id);
  const product = productManager.getProductById(id);
  if (product) 
  {
    res.status(200).send(product);
  } 
  else 
  {
    res.status(404).send({ error: 'Producto no encontrado' });
  }
});




routerProduct.post('/imagen/:pid', uploader.single('file'), (req,res) =>
{
  const products = productManager.getProducts()
  const productId= parseInt(req.params.pid);
  const product = productManager.getProductById(productId);

  if(!req.file)
  {
    res.status(400).send({ status: 'error', error: "No se pudo guardar la imagen." });
  }
  const path= req.file.path
  product.thumbnail=path

  productManager.saveProductFiles();
  res.send({ status: 'success', message: 'Thumbnail created' })
})

routerProduct.post('/',async (req,res)=>
{
    //const productsArchivo = productManager.readProductsFromFile ()
    const products =productManager.getProducts()
    const newProduct = req.body;
    const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
    const missingFields = requiredFields.filter((field) => !newProduct[field]);

    
    if (missingFields.length > 0) 
    {
      return res.status(400).json({ error: `Faltan los siguientes campos obligatorios: ${missingFields}` });  
    }

    newProduct.status = newProduct.status ?? true;

    const productId = productManager.addProduct(newProduct);
    let index = productId-1

    //productManager.addProduct(newProduct);
    products[index].id = productId
    //products.push(newProduct) //Con esto hace el 4
    await productManager.saveProductFiles();
    res.status(200).json( products );
})

routerProduct.put('/:pid', (req,res)=>
{
  const products =productManager.getProducts()
  const productId= parseInt(req.params.pid)
  const productToUpdate = req.body;
  try
  {
    const updateProduct= productManager.updateProducts(productId,productToUpdate);

    if(!productToUpdate)
    {
      res.status(404).send({error:'Product not found'});
      return;
    }
    
    res.status(200).json({productToUpdate, products });
  }
  catch(error)
  {
    res.status(400).send({ error: error.message });
  }
})
  

routerProduct.delete('/:pid',(req,res)=>
{
  const id= parseInt(req.params.pid)

    const deletedProduct= productManager.deleteProduct(id);

    if( !deletedProduct)
    {
      res.status(404).send({ error: 'Product not found' });
      return;
    }
    
    res.status(200).json(`Producto eliminado id: ${id}`);
  

})

  export default routerProduct