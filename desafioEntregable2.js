const fs = require('fs').promises

class ProductManager{



    constructor ()
    {
        this.products =[]
        this.idAuto = 1;
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
            console.log(index)

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




   addProduct(title,description,price,thumbnail,code,stock)
    {
        if(!title || !description || !price || ! thumbnail || !code || !stock)
        {
            throw Error ('Todos los campos son obligatorios')
        }

        const sameCode = this.products.find(product => product.code === code)

        if(sameCode)
        {
            throw Error ('El código ya está en uso')
        }

        const product ={
            id:this.idAuto,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        }
        
        this.products.push(product);
        this.idAuto ++
        return product
    }
    getProducts(){
        return this.products;
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

let producto1 = productManager.addProduct("Cerámica gris carrara", "Caja de 25 cerámicas de 25x25", 1345, "ruta/imagen1.jpg", "CE-01", 100);

let producto2 = productManager.addProduct("Perfil IPN 80", "Perfil IPN 80 de 12m de largo", 17845, "ruta/imagen2.jpg", "PR-E-01", 107);

let producto3 = productManager.addProduct("Sillas Tulip", "2 Sillas Tipo Tullip", 18900, "ruta/imagen3.jpg", "MO-SI-01", 37);

// // console.log(productManager.getProducts());
// // console.log(productManager.getProductById(2))


// productManager.saveProductFiles();


productManager.updateProducts(1,producto2)

//productManager.deleteProduct (1)