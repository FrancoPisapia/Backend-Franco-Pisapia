import mongoose from 'mongoose';

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
    //Propiedades que querramos que tenga el usuario en nuestra base de datos
    products: [{
        productID: { type: String, required: true },
        quantity: { type: Number,required: true}
      }]
});


// const cartSchema = new mongoose.Schema({
//     id: { type: Number, unique: true, required: true },
//     products: [{
//       product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
//       quantity: { type: Number, default: 1 }
//     }]
//   });
//Con mongoose model generamos el modelo funcional de usuarios conectados a la base de datos , la parte del cuerpo es el userSchema, pero el userModel refiere a la parte funcional

export const cartModel = mongoose.model(cartsCollection,cartsSchema);