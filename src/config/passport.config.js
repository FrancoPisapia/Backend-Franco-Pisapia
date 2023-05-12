import passport from 'passport';
import local from 'passport-local';
import {userModel} from '../dao/models/usersModel.js'
import {createHash, isValidPassword} from '../utils/hash.js';
import GitHubStrategy from 'passport-github2'

const LocalStrategy = local.Strategy;

const initializePassport = () =>{
    //Passport uitiliza sus propias middlewares s/ cada estrategia

    //Inicializamos passport
    passport.use('register',new LocalStrategy(
        //passReqToCallback: permite acceder al objeto como middleware
        {passReqToCallback:true,usernameField:'email'},async (req,username,password,done)=>{
        const {firstName,lastName,email,age} = req.body;

            try {
                let user = await userModel.findOne({email:username});

                if (user){
                    //No encontrar un usuario no significa que sea un error, así que el error lo pasamos como null, pero al usuario como false .
                    //Esto significa "No ocurrio un error al buscar, sino que este ya existe"

                    console.log('User already exists');
                    return done(null,false)
                }
                const newUser ={
                    firstName,
                    lastName,
                    email,
                    age,
                    password:createHash(password)
                }

                let result = await userModel.create(newUser);

                //Si todo sale bien mandamos null, usuario generado

                return done (null,result)

            }catch (e){
                return done (`Error al obtener el usuario ${e}`)
            }
        }
    ))

    passport.serializeUser((user,done) =>{
        done(null,user._id)
    });

}

passport.deserializeUser(async (id,done ) =>{
    let user = await userModel.findById(id);
    done (null,user)
});


passport.use ('login',new LocalStrategy({usernameField:'email'},async (username,password,done)=>{

    const user = await userModel.findOne({email:username})
    try {
        if(!user){
            console.log("User doesn't exist")
            return done (null,false)
        }
        if( !isValidPassword(user,password)) return done (null,false);
        return done (null, user)

    } catch (e){
        return done(e)
    }
}))

export default initializePassport;