class ProductManager{
    products =[]

    constructor (title,description,price,thumbnail,code,stock)
    {
        this.title=title;
        this.description=description;
        this.price= price;
        this.thumbnail =thumbnail;
        this.code= code;
        this.stock =stock
    }

    verif(){
        console.log(products)
    }
}

console.log(ProductManager.products)