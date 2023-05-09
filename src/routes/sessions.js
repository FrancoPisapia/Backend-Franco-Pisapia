import express from 'express'
import uploader from '../utils/multer.js'
import { userModel } from '../dao/models/usersModel.js';


const app = express();
const routerSessions = express.Router(); 
app.use(express.urlencoded({extended:true}));



//*****Midlewares ******/
const auth = async (req,res,next) =>{
    const {email,password } = req.body
    const existingUser = await userModel.findOne({ email:email });

    if (req.session.email == existingUser.email && req.session.password == existingUser.password) {
        //409 la peticion tuvo un conflicto
        return next()
    }
    return res.status(401).send('Authorization error')
  }



//*****Endpoints ******/
routerSessions.post('/sigup',async (req,res) =>{
    const { firstName, lastName, email, age, password } = req.body
    try{
        const existingUser = await userModel.findOne({ email:email});
        //console.log(email)
        if (existingUser) {
            //409 la peticion tuvo un conflicto
            return res.status(409).send({ message: 'El usuario ya existe' });
        } else if( !existingUser && email === "adminCoder@coder.com" && password === "adminCod3r123"){
            let result2 = await userModel.create({
            firstName,
            lastName,
            email,
            age,
            password,
            rol:"Admin"
         });
         res.status(201).send(result2)
        } else{

        let result = await userModel.create({
            firstName,
            lastName,
            email,
            age,
            password
         });
         res.status(201).send(result)
        }

    }
    catch (e)
    {
        res.status(500).send({ message: 'Error en el servidor', e });
    }
    
});

//******Público ******/
// const publicRouteMiddleware = (req, res, next) => {
//     // Verificar si no hay una sesión activa
//     if (!req.session || !req.session.user) {
//       // Redirigir a la pantalla de inicio de sesión
//       return res.redirect('/login');
//     }
  
//     // Continuar con la siguiente ruta
//     next();
//   };

// //******Privado ******/
//   const privateRouteMiddleware = (req, res, next) => {
//     // Verificar si hay una sesión activa
//     if (req.session && req.session.user) {
//       // Redirigir a la pantalla de perfil
//       return res.redirect('/profile');
//     }
  
//     // Continuar con la siguiente ruta
//     next();
//   };

routerSessions.post('/login',async (req,res) =>{
    const {email,password } = req.body

    try{


        const existingUser = await userModel.findOne({ email:email});

        if (!existingUser) {
            
            return res.status(404).send({ message: 'El usuario no existe' });
        } else if (existingUser.password != password){
            return res.status(404).send({ message: 'Contrseña incorrecta' });
        }

        req.session.email =email;
        req.session.password =password;


         res.status(200).send(`Bienvenido ${existingUser.firstName}`)
    }
    catch (e)
    {
        res.status(500).send({ message: 'Error en el servidor', e });
    }
    
});

routerSessions.post('/privado', auth, (req,res) =>{

  res.status(200).redirect('/api/products')
  })


routerSessions.post ('/logout',(req,res) =>{
    req.session.destroy(err=>{
      if(err){
        return res.send({status:'logout error',body:err})
      }
      res.send('Logout succeed')
    })
  })


export default routerSessions