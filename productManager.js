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
        try
        {
            const data = await fs.readFile(this.path,'utf-8');
            this.products = JSON.parse(data)
        } catch
        {
            throw new Error ('No pudo leerse')
        }
    }

    async saveProductFiles ()
    {
        try 
        {
            fs.writeFile (this.path, JSON.stringify(this.products))
        } 
        catch 
        {
            throw new Error ('No se guardo')
        }
    }

    async updateProducts (id,updateProducts)
    {
        try
        {
            const index = await this.products.findIndex((product) => product.id === id)

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
            throw new Error ('No se actualizo')
        }

    }

    async deleteProduct (id)
    {
        try
        {
            const index = await this.products.findIndex((product) => product.id === id)

            if( index !== -1)
            {
                this.products.splice(index,1);
                this.saveProductFiles ()

            }
        } 
        catch 
        {
            throw new Error ('No se borro')
        }

    }




   addProduct(prod)
    {
        if (Object.values(prod).some((item) => !item)) {
            throw new Error("Todos los campos del producto son obligatorios");
        }

        
        const sameCode = this.products.find(product => product.code === prod.code)

        if(sameCode)
        {
            throw Error ('El código ya está en uso')
        }

        
                
        this.idAuto ++
        return this.products.push({ ...prod, id: this.idAuto });

    }
    getProducts(){
        return console.log(this.products);
    }

    getProductById (id)
    {
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



productManager.addProduct(producto1);
productManager.addProduct(producto2);
productManager.addProduct(producto3)
productManager.getProducts();


//console.log(productManager.getProductById(2))


//productManager.saveProductFiles();
// console.log(producnoto2.stock)
// producto2.stock=50
// console.log(producto2.stock)
//productManager.updateProducts(1,producto2)

//productManager.deleteProduct (1