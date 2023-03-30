// const { readFileSync, read } = require('fs');
// const { json } = require('stream/consumers');


// const fs = require('fs').promises


import { readFileSync } from 'fs';
import { json } from 'stream/consumers';
import fs from 'fs/promises';

export class ProductManager{

    constructor ()
    {
        this.products =[]
        this.idAuto = 0;
        this.path='Productos.json'
    }

    async readProductsFromFile ()
    {
        //Leo el archivo json (si este existe) y parseo la info dentro de el

        
        try
        {
            await fs.access(this.path);
            const data = await fs.readFile(this.path,'utf-8');
            return this.products = JSON.parse(data)
        } catch (error)
        {
            console.log(`El archivo ${this.path} no existe, creando...`)
            await fs.writeFile(this.path, '[]');
            return []

           
            
        }
    }

    async saveProductFiles ()
    {
        // Creo el archivo JSON y stringifeo la info del array products 

        
        //this.readProductsFromFile()
        try 
        {
            
            fs.writeFile (this.path, JSON.stringify(this.products))
        } 
        catch (error)
        {
            console.log(`No puede crearse el archivo: ${error.message}`)
           
        }
    }

    async updateProducts (id,updateProducts)
    {
        try
        {
            // Verifico si existe el producto por su id y me devuelve su ubicacion en el array
            const index = await this.products.findIndex((product) => product.id === id)
            //Si el array existe, reemplazo el producto por su index con el update product

            if( index !== -1)
            {
                this.products[index] = 
                {
                    ...this.products[index],
                    ...updateProducts,
                    id
                }
                await this.saveProductFiles ();
                return true
            } 
            else
            {
            throw new Error("No se encontró el producto con el id proporcionado.");
            }

        } 
        catch (error)
        {
            throw new Error (`No puede actualziarse el elemento: ${error.message}`)
        }

    }

    async deleteProduct(id) {
        try {
          await this.readProductsFromFile();

          //const index = this.products.findIndex((product) => product.id === id);
          const product = this.products.find((product) => product.id === id);
      
          if (product) 
          {

            this.products= this.products.filter((prod) => prod.id !== id)

            await this.saveProductFiles();
            return true;
          }
          return false;

        } 

        catch (error)
        {
          throw new Error(`No se puede eliminar el producto : ${error.message}`);
        }
      }


   addProduct(prod)
    {
        //Verificar si ALGUNO de sus values es undefined
        if (Object.values(prod).some((item) => !item)) { 
            throw new Error("Todos los campos del producto son obligatorios");
        }

        //Verifico que el mismo código no este en uso
        const sameCode = this.products.find(product => product.code === prod.code)

        if(sameCode)
        {
            throw Error ('El código ya está en uso')
        }
      
        //Defino el id y devuelvo el elemento en forma de objeto
        this.idAuto ++
        return this.products.push({ ...prod, id: this.idAuto });
        

    }
    getProducts(){
        //Devuelvo los productos por consola
        this.saveProductFiles();
        return this.products;
    }

    async getProductById (id)
    {
        const products = this.readProductsFromFile()
        //Busco si el producto existe con el id y si existe me lo devuele sino me tira error
       const product= this.products.find((product)=> product.id ===id);

       if( product)
       {
        return product
       }else
       {
        console.error ('Not found')
       }

    }



}


export class CartManager {
    constructor() {
      this.carts = [];
      this.idAuto = 0;
      this.path= 'carts.json'
      this.productsPath='Productos.json'
    }
  
    createCart() {
      const newCart = { id: ++this.idAuto, products: [] };
      this.carts.push(newCart);
      this.saveCartFiles ()
      return newCart;
    }


    async saveCartFiles ()
    {
        // Creo el archivo JSON y stringifeo la info del array products 

        
        //this.readProductsFromFile()
        try 
        {
            
            fs.writeFile (this.path, JSON.stringify(this.carts))
        } 
        catch (error)
        {
            console.log(`No puede crearse el archivo: ${error.message}`)
           
        }
    }
  
    getCartById(cartId) {
        const carts= this.carts.find((cart)=> cart.id ===cartId);

        if( carts)
        {
         return carts
        }else
        {
         console.error ('Not found')
        }
    }
  
    // addProductToCart(cartId, productId) {
    //     const cart = this.getCartById(cartId);
    //     if (!cart) {
    //       throw new Error(`Cart with id ${cartId} not found`);
    //     }
        
    //     const product = productManager.getProductById(productId);
    //     if (!product) {
    //       throw new Error(`Product with id ${productId} not found`);
    //     }
    
    //     // Check if product is already in the cart
    //     const existingProduct = cart.products.find((p) => p.id === productId);
    //     if (existingProduct) {
    //       existingProduct.quantity++;
    //     } else {
    //       cart.products.push({ ...product, quantity: 1 });
    //     }
    
    //     this.saveCartFiles();
    //   }

      // removeProductFromCart(cartId, productId) {

      //   const cart = this.getCartById(cartId);
      //   if (!cart) 
      //   {
      //       throw new Error(`Cart with id ${cartId} not found`);
      //   }

      //   const cartIndex = this.carts.findIndex((cart) => cart.id === cartId);
      //   if (cartIndex === -1) {
      //     throw new Error('Cart not found');
      //   }
        
      //   const productIndex = this.carts[cartIndex].products.findIndex((product) => product.id === productId);
      //   if (productIndex === -1) {
      //     throw new Error('Product not found in cart');
      //   }
      
      //   this.carts[cartIndex].products.splice(productIndex, 1);
      //   this.saveCartFiles();
      // }
  }

  const productManager = new ProductManager ();

// let producto1 = {
//     title:"Cerámica gris carrara", 
//     description:"Caja de 25 cerámicas de 25x25", 
//     price: 1345, 
//     thumnail:"ruta/imagen1.jpg",
//     category:'Solados',
//     code: "CE-01",
//     status:'true',
//     stock: 100};

// let producto2 = {
//     title:"Perfil IPN 80", 
//     description:"Perfil IPN 80 de 12m de largo",
//     price:17845, 
//     thumbnail:"ruta/imagen2.jpg", 
//     category:'Perfiles de acero',
//     code:"PR-E-01", 
//     status:'true',
//     stock:107};

// let producto3 = {
//     title:"Sillas Tulip", 
//     description:"2 Sillas Tipo Tullip",
//     price: 18900, 
//     thumbnail:"ruta/imagen3.jpg",
//     category:'Mobiliario',
//     code: "MO-SI-01",
//     status:'true',
//     stock: 37};


    


// //Agrego los productos
// productManager.addProduct(producto1);
// productManager.addProduct(producto2);
// productManager.addProduct(producto3);

// //Obtengo los producto
// productManager.getProducts();

// //Obtengo los productos por id
//console.log(productManager.getProductById(2))

// //Creo el archivo JSON 
//productManager.saveProductFiles();


// producto3 = {
//     title:"Sillas Tolix", 
//     description:"2 Sillas metálicas tipo Tolix",
//     price: 18900, 
//     thumbnail:"ruta/imagen3.jpg",
//     category:'Mobiliario',
//     code: "MO-SI-02",
//     status:'true',
//     stock: 37};

// productManager.updateProducts(3,producto3);

//const cartManager = new CartManager ();

//console.log(cartManager.createCart()); //Anda
//console.log(cartManager.getCartById(1));//Anda;
//console.log(productManager.getProducts())//anda

//console.log(productManager.getProductById(2))//anda
//cartManager.addProductToCart(1,2);


//cartManager.removeProductFromCart(1,2)

//cartManager.createCart(); //Anda