import {CartManager,ProductManager} from '../productManager.js';
import express from 'express'
import uploader from '../utils.js'

const app = express();
const routerCart = express.Router(); 
app.use(express.urlencoded({extended:true}))

const cartManager = new CartManager();
const productManager = new ProductManager();


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
  const productId = parseInt(req.params.pid)
  
  const cart = cartManager.getCartById(cartId);
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  
  const existingProduct = cart.products.find(p => p.product === productId);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.products.push({ product: productId, quantity: 1 });
  }
  
  cartManager.saveCartFiles();
  
  res.json({ message: 'Product added to cart', cart });
});


  export default routerCart

