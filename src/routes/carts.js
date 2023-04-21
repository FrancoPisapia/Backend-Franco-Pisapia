import {ProductManager,CartManager} from '../dao/fileSystem/Managers.js';
import express from 'express'
import uploader from '../utils/multer.js'
import { cartModel } from '../dao/models/cartsModels.js';
import { productsModel } from '../dao/models/productsModels.js';

const app = express();
const routerCart = express.Router(); 
app.use(express.urlencoded({extended:true}))

const cartManager = new CartManager();
const productManager = new ProductManager();


//  **********************************Mongo DataBase*************************************************//
//Crear un carrito vacio
routerCart.post('/',async (req,res)=>{

  let products = []
  const carts = await cartModel.create({
    products
  })
  res.status(200).json( carts);
});

//Buscar todos los carritos
routerCart.get('/', async (req,res)=>{
  try{
    let carts = await cartModel.find();
    //res.send({result:'seccess',payload:products});
    res.status(200).send(carts)
 }
 catch (e)
 {
    console.log(`cannot get users with mongoose ${e}`)
 }

});
//Buscar un carrito
routerCart.get('/:cid', async (req,res)=>{
  let {cid}= req.params
  try{
    let cart = await cartModel.find({_id:cid});
    //res.send({result:'seccess',payload:products});
    res.status(200).send(cart)
 }
 catch (e)
 {
    console.log(`cannot get users with mongoose ${e}`)
 }

});


//Agregar productos aun carrito existente
routerCart.post('/:cid/product/:pid', async (req, res) =>{
  const {cid, pid} = req.params;
  //const {pid} = (req.params.pid);
  const products = await productsModel.find()
  const cart = await cartModel.find({_id:cid});
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  console.log(products);
  const product = await productsModel.find({ code: pid });
  //const product = products.find(c => c.code === pid);
  console.log(product)
  // const product = await cartModel.find({'products._id':pid});
  // if (!product) {
  //   return res.status(404).json({ message: 'Product not found' });
  // }

    
  // const existingProduct = await cartModel.find({products:pid})
  // if (existingProduct) {
  //   existingProduct.quantity++;
  // } else {
  //   await cartModel.create({ 
  //     product: pid, 
  //     quantity: 1 
  //   });
  // }
  
  res.status(200).json({ message: 'Product added to cart', product });
});












//  **********************************FileSystem*************************************************//
routerCart.post('/', (req, res) => {
  
  const carts = cartManager.createCart();


  res.status(200).json( carts);
});

routerCart.get('/:cid',(req,res)=>{
  const cartId = parseInt(req.params.cid);
  const cart = cartManager.getCartById(cartId);
  

  if (!cart) {
    res.status(404).send(`Cart with id ${cartId} not found`);
  } else {
    res.status(200).json(cart.products);
  }
});


routerCart.post('/:cid/product/:pid', (req, res) => {
  const cartId = parseInt(req.params.cid)
  const productId = parseInt(req.params.pid);
  
  const cart = cartManager.getCartById(cartId);
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  const product = productManager.getProductById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  
  const existingProduct = cart.products.find(p => p.product === productId);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.products.push({ product: productId, quantity: 1 });
  }
  
  cartManager.saveCartFiles();

  res.status(200).json({ message: 'Product added to cart', cart });
});


routerCart.delete('/:cid/product/:pid', (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  
  const cart = cartManager.getCartById(cartId);
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  
  const existingProduct = cart.products.find(p => p.product === productId);
  if (existingProduct) {
  if (existingProduct.quantity > 1) {
  existingProduct.quantity--;
  } 
  else 
  {
  const index = cart.products.indexOf(existingProduct);
  cart.products.splice(index, 1);
  }
  } else {
  return res.status(404).json({ message: 'Product not found in cart' });
  }
  
  cartManager.saveCartFiles();
  
  res.status(200).json({ message: 'Product removed from cart', cart });
  });

  export default routerCart