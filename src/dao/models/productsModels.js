import mongoose from 'mongoose';

const productsCollection = 'products';

const productsSchema = new mongoose.Schema({
    //Propiedades que querramos que tenga el usuario en nuestra base de datos
    title: { type: String, required: true },
    description: { type: String, required: true },
    code:{type:String,require:true, unique: true },
    price:{type:Number,require:true},
    stock:{type:Number,require:true},
    category:{type:String,require:true},
    thumbnail:{type: String}
    //thumbnail:{}
    
});

//Con mongoose model generamos el modelo funcional de usuarios conectados a la base de datos , la parte del cuerpo es el userSchema, pero el userModel refiere a la parte funcional

export const productsModel = mongoose.model(productsCollection,productsSchema);