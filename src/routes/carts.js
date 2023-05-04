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
    res.status(200).send(carts)
 }
 catch (e)
 {
    console.log(`cannot get carts with mongoose ${e}`)
 }

});
//Buscar un carrito
routerCart.get('/:cid', async (req,res)=>{
  let {cid}= req.params
  try{
    let cart = await cartModel.find({_id:cid}).populate('products._id');
    res.status(200).send({payload:cart})
 }
 catch (e)
 {
    console.log(`cannot get users with mongoose ${e}`)
 }

});


//Agregar productos aun carrito existente
routerCart.post('/:cid/product/:pid', async (req, res) =>{
  const {cid, pid} = req.params;

  const cart = await cartModel.find({_id:cid});
  if (cart.length === 0) {
    return res.status(404).send({ message: 'Cart not found' });
  }

  const product = await productsModel.findOne({ _id: pid });
  if (!product) {
    return res.status(404).send({ message: 'Product not found' });
  }

  const productInCarts = await cartModel.findOne({ _id: cid, "products._id": pid });

  if (productInCarts) {

    const result = await cartModel.updateOne(
      {_id:cid,"products._id":pid},
      {$inc:{"products.$.quantity":1}});
  } else {
    const result = await cartModel.updateOne(
      {_id:cid},
      {$push:{products: {_id:pid,quantity:1}}})
  }

  res.status(200).send({ message: 'Product added to cart', cart});
});

//Actualizar todo el carrito por body
routerCart.put('/:cid', async (req,res) =>{
  const {cid} = req.params;
  const product = req.body

  const cart = await cartModel.find({_id:cid});
  if (cart.length === 0) {
    return res.status(404).send({ message: 'Cart not found' });
  }

  if (!product._id || !product.quantity){
    return res.send({status:404,error : "Complete all values"});
  }

  let result= await cartModel.updateOne (
    {_id:cid},
    { $set: { products: product } });
  res.status(200).send(result)

})




//Actualizar la cantidad de productos desde el body
routerCart.put('/:cid/product/:pid', async (req, res) =>{
  const {cid, pid} = req.params;
  const {quantity} = req.body

  const cart = await cartModel.find({_id:cid});
  if (cart.length === 0) {
    return res.status(404).send({ message: 'Cart not found' });
  }

  const product = await productsModel.findOne({ _id: pid });
  if (!product) {
    return res.status(404).send({ message: 'Product not found' });
  }

  const productInCarts = await cartModel.findOne({ _id: cid, "products._id": pid });

  if (productInCarts) {

    const result = await cartModel.updateOne(
      {_id:cid,"products._id":pid},
      {"products.$.quantity":quantity});
  }

  res.status(200).send({ message: 'Product added to cart', cart});
});



//Eliminar un producto existente
routerCart.delete('/:cid/product/:pid', async (req, res) =>{
  const {cid, pid} = req.params;


  const cart = await cartModel.find({_id:cid});
  if (cart.length === 0) {
    return res.status(404).send({ message: 'Cart not found' });
  }

  const product = await productsModel.findOne({ _id: pid });
  if (!product) {
    return res.status(404).send({ message: 'Product not found' });
  }

  const productInCarts = await cartModel.findOne({ _id: cid, "products._id": pid });

  if(productInCarts){
  const updatedCart = await cartModel.findOneAndUpdate(
    { 
      _id: cid,
      products: { $elemMatch: { _id: pid, quantity: { $gt: 1 } } }
    },
    { $inc: { "products.$.quantity": -1 } }
  );
  
  if (!updatedCart) {
    // Si updatedCart es null, significa que no se encontró un documento que cumpla los criterios de búsqueda
    await cartModel.updateOne(
    {_id:cid},
    {$pull:{products: {_id:pid,quantity:1}}})
  } 
  }else{
    return res.status(404).send({ message: 'product does not exist in cart' });
  }

  res.status(200).send({ message: 'Product removed from carts', cart});
})

//Elimina todos los productos del carrito
routerCart.delete('/:cid', async (req, res) =>{
  const {cid} = req.params;


  const cart = await cartModel.find({_id:cid})
  if (cart.length === 0) {
    return res.status(404).send({ message: 'Cart not found' });
  }

  const productsInCart = await cartModel.findOne(
    { _id: cid, products: [] }
  );


  if(productsInCart){
    const result = await cartModel.deleteOne({_id:cid})
    res.status(200).send({ message: 'Cart deleted'});
  } else{
    const result = await cartModel.updateOne(
      {_id:cid},
      {$set:{products:[]}})
    
    
      res.status(200).send({ message: 'Products removed from carts',result});
  }


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