import jwt from 'jsonwebtoken'

const PrivateKey = 'CoderTokenFP';

/* Generamos el token
El primer argumento es un objeto con la info
El segundo argumento es la llave privada con la que se hará el cifrado
El tercer argumento el tiempo de experiacion del token
 */

export const generateToken =   (user) =>{
    return  jwt.sign({user, password:undefined},PrivateKey,{expiresIn:'24h'});
    
}

export const authToken = (req, res, next) => {

    const authHeader = req.headers.authorization;
  
    if (!authHeader) return res.status(401).send({ error: 'Empty authentication header!' });
  
    const token = authHeader.split(' ')[1];

    jwt.verify(token, PrivateKey, (error, credentials) => {
      if (error) return res.status(403).send({ error: 'Authentication error' });
  
      req.user = credentials.user;
  
      next();
    });
  };