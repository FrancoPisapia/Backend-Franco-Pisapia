const { readFileSync } = require('fs');
const { json } = require('stream/consumers');

const fs = require('fs').promises

class ProductManager{

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
            const data = await fs.readFile(this.path,'utf-8');
            return this.products = JSON.parse(data)
        } catch
        {
            throw new Error ('No puede leerse')
        }
    }

    async saveProductFiles ()
    {
        // Creo el archivo JSON y stringifeo la info del array products 
        try 
        {
            fs.writeFile (this.path, JSON.stringify(this.products))
        } 
        catch 
        {
            throw new Error ('No se guardó')
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
            }
            this.saveProductFiles ()
        } 
        catch 
        {
            throw new Error ('No hay archivo para actualizar, correr saveProductsFile')
        }

    }

    async deleteProduct(id) {
        try {
          await this.readProductsFromFile();
          const index = this.products.findIndex((product) => product.id === id);
          const product = this.products.find((product) => product.id === id);
      
          if (index !== -1) 
          {
            this.products.splice(index, 1);
            await this.saveProductFiles();
            return true;
          }
          return false;

        } 
        catch 
        {
          throw new Error("No existe el producto a eliminar");
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
        return console.log(this.products);
    }

    getProductById (id)
    {
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

const productManager = new ProductManager ();

let producto1 = {
    title:"Cerámica gris carrara", 
    description:"Caja de 25 cerámicas de 25x25", 
    price: 1345, 
    thumnail:"ruta/imagen1.jpg",
    code: "CE-01",
    sotck: 100};

let producto2 = {
    title:"Perfil IPN 80", 
    description:"Perfil IPN 80 de 12m de largo",
    price:17845, 
    thumbnail:"ruta/imagen2.jpg", 
    code:"PR-E-01", 
    stock:107};

let producto3 = {
    title:"Sillas Tulip", 
    description:"2 Sillas Tipo Tullip",
    price: 18900, 
    thumbnail:"ruta/imagen3.jpg",
    code: "MO-SI-01",
    stock: 37};

    


//Agrego los productos
productManager.addProduct(producto1);
productManager.addProduct(producto2);
productManager.addProduct(producto3);

//Obtengo los productos
productManager.getProducts();

//Obtengo los productos por id
//console.log(productManager.getProductById(2))


producto3 = {
    title:"Sillas Tolix", 
    description:"2 Sillas metálicas tipo Tolix",
    price: 18900, 
    thumbnail:"ruta/imagen3.jpg",
    code: "MO-SI-01",
    stock: 37};

productManager.updateProducts(3,producto3)



//Borrar un producto (para que funcione no tiene que estar declar)

productManager.deleteProduct(3);

//Creo el archivo JSON 
productManager.saveProductFiles();