import express from 'express'
import productsRouter from './routes/products.js'
import cartsRouter from './routes/carts.js';
import chatRouter from './routes/chat.js';
import handlebars from 'express-handlebars';
import __dirname from './utils/handlebars.js';
import {Server} from 'socket.io';
import mongoose from "mongoose";
import { messageModel } from './dao/models/messagesModels.js';
import MongoStore from 'connect-mongo';
import routerSessions from './routes/sessions.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';



const app = express();

app.use(express.urlencoded({extended:true}))


const httpServer=app.listen(8080,() => console.log('Servidor arriba en el puerto 8080'));
const socketServer = new Server (httpServer);

//Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine', 'handlebars')
app.use(express.static(__dirname+'/public'))
app.use('/api/chat',chatRouter);


//Mongoose
mongoose.connect('mongodb+srv://francopisapia405:uPTbiSDQYTlKc3wm@codercluster.xlmgp1b.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to database'))
  .catch((err) => console.log(`Error connecting to database: ${err}`));

//Session con Mongo

app.use(cookieParser())

app.use(session({
    store: MongoStore.create({
        mongoUrl:"mongodb+srv://francopisapia405:uPTbiSDQYTlKc3wm@codercluster.xlmgp1b.mongodb.net/?retryWrites=true&w=majority",
        mongoOptions:{useNewUrlParser:true,useUnifiedTopology:true},
        ttl:100
      }),
      secret:"asd3ñc3okasod",
      //Resave mantiene la sesión activa, de estar en false está morirá en caso de que exista inactividad
      resave:false,
      //saveUnitialized permite guardar cualquier sesión. De estar en false la sesión no se guardará si está vacio el objeto final
      saveUninitialized:false
    }))






//Routers
app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', routerSessions);
//app.use('/api/session', routerSession);





//******PARA EL CHAT ***** */
let messages =[];
socketServer.on('connection',socket =>{
    console.log('Nuevo cliente conectado');

    socket.on ('message', async data =>{
        messages.push(data);
        socketServer.emit('messageLogs',messages);
        
        await messageModel.create(data)
    });

    socket.on('login', (user) => {
        console.log(`El usuario ${user} se ha conectado`);
        socket.user = user;
        socket.emit('messageLogs', messages);
        socket.broadcast.emit('userConnected', user);
    });

})

