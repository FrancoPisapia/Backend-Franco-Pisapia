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

  let products = [{
    productID:"",
    quantity:0
  }]
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
  const productToAdd = req.body;

  //const {pid} = (req.params.pid);

  const cart = await cartModel.find({_id:cid});
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  const product = await productsModel.findOne({ _id: pid });
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }




  const existingProduct = await cartModel.find({products:{$elemMatch:{_id:pid}}});

  console.log(cart);
  console.log(existingProduct[0].products)

  //const existingProduct = await cartModel.find({products:{$elemMatch: { quantity: 5 }}});


  //console.log(existingProduct)

  // if (existingProduct.length != 0) {
  //   existingProduct:{
  //     quantity ++
  //   }
  // } else {
  //   const push = {
  //     _id:pid,
  //     quantity:1
  //   }

    
    //const cartNuevo = cart[0].products.push(push)

    //const result = cartModel.updateOne({_id:cid}, cartNuevo);
    //console.log(result)
  //}

  //let result= await cartModel.updateOne ({_id:cid},productToAdd);
  //res.status(200).send(result)
  //res.status(200).json({ message: 'Product added to cart', cart});
});



routerCart.delete('/:cid', async (req,res)=>{
  const cid = req.params;
  let result = await cartModel.deleteOne({_id:cid});
  res.status(200).send(result)
})












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