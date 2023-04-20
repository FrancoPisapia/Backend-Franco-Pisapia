import {ProductManager} from '../dao/fileSystem/Managers.js';
import express from 'express'
import uploader from '../utils/multer.js'
import { productsModel } from '../dao/models/productsModels.js';
import router from '../../../clases/clase 14 20-04-23/Ejercicio-clase/src/routes/studentsRouters.js';


const app = express();
const routerProduct = express.Router(); 
app.use(express.urlencoded({extended:true}))

const productManager = new ProductManager ();


//  **********************************Mongo DataBase*************************************************//
//Busqueda de todos los objetos
routerProduct.get ('/',async (req,res)=>{
 try{
    let products = await productsModel.find();
    //res.send({result:'seccess',payload:products});
    res.status(200).send(products)
 }
 catch (e)
 {
    console.log(`cannot get users with mongoose ${e}`)
 }

});


//Busqueda de objeto por id
routerProduct.get ('/:pid',async (req,res)=>{

    let {pid} = req.params
    let product = await productsModel.find({_id:pid});
    
    if(product){
      res.status(200).send(product)
    } else {
      res.status(404).send({ error: 'Producto no encontrado' });
    }
 });

routerProduct.post('/',async (req,res)=>{

  let {title,description,code,price,stock,category} =req.body;

  if(!title||!description||!code || !price || !stock || !category) return res.send({status:404, error:'Incomplete values'});


  let result = await productsModel.create({
     title,
     description,
     code,
     price,
     stock,
     category
  });

  res.status(200).send(result)
});

routerProduct.put('/:pid',async (req,res)=>{
  let {pid} = req.params;

  let productToReplace = req.body;
  if(!productToReplace.title || !productToReplace.description|| !productToReplace.code || !productToReplace.price || !productToReplace.stock || !productToReplace.category){
     return res.send({status:404,error : "Complete all values"});
  };
  let result= await productsModel.updateOne ({_id:pid},productToReplace);
  res.status(200).send(result)
});


routerProduct.delete ('/:pid', async (req,res)=>{
  let {pid} = req.params;
  let result = await productsModel.deleteOne({_id:pid});
  res.status(200).send(result)
});







//  **********************************FileSystem*************************************************//
(async () => {
  await productManager.readProductsFromFile();
})();

routerProduct.get('/', (req, res) =>
  {
    const products =productManager.getProducts()
 
    const limit = parseInt(req.query.limit)

    if( Number.isNaN(limit) || limit >= products.length) 
    {
      //return res.send (products);
      return res.render('index',{
        products
      })
    } 
    else
    {
      let productosFiltrados = products.slice(0,limit)
      //res.status(200).send(productosFiltrados);
      return res.render('index',{
        productosFiltrados
      })
    }


});

//Actualizacion producto
routerProduct.get('/realtimeProducts',(req,res)=>{
  const products =productManager.getProducts()
 
  const limit = parseInt(req.query.limit)

  if( Number.isNaN(limit) || limit >= products.length) 
  {
    //return res.send (products);
    return res.render('realTimeProducts',{
      products
    })
  } 
  else
  {
    let productosFiltrados = products.slice(0,limit)
    //res.status(200).send(productosFiltrados);
    return res.render('realTimeProducts',{
      productosFiltrados
    })

  }


});

// routerProduct.get('/p',(req,res)=>{
//   const products =productManager.getProducts()
//     res.render('index',{
//       products
//     })
// });



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