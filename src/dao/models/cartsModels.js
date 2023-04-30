import mongoose from 'mongoose';

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
    //Propiedades que querramos que tenga el usuario en nuestra base de datos

    //******ANDA CON ESTO ******/
    // products: [{
    //     quantity: { type: Number,required: true}
    //   }]


    //*****PREUBA POPULATE *******/
    products:{
      type:[
          {
              _id:{
                  type:mongoose.Schema.Types.ObjectID,
                  ref:'products',
              },
              quantity:{type: Number,required: true}
          }
      ],
      default:[]
  }
});

// cartsSchema.pre('find', function (){
//     this.populate('products.product');
// })


//Con mongoose model generamos el modelo funcional de usuarios conectados a la base de datos , la parte del cuerpo es el userSchema, pero el userModel refiere a la parte funcional

export const cartModel = mongoose.model(cartsCollection,cartsSchema);