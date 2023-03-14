class ProductManager{



    constructor ()
    {
        this.products =[]
        this.idAuto = 1;
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

const producto1 = productManager.addProduct("Cerámica gris carrara", "Caja de 25 cerámicas de 25x25", 1345, "ruta/imagen1.jpg", "CE-01", 100);

const producto2 = productManager.addProduct("Perfil IPN 80", "Perfil IPN 80 de 12m de largo", 17845, "ruta/imagen2.jpg", "PR-E-01", 107);

const producto3 = productManager.addProduct("Sillas Tulip", "2 Sillas Tipo Tullip", 18900, "ruta/imagen3.jpg", "MO-SI-01", 37);

console.log(productManager.getProducts());
console.log(productManager.getProductById(2))