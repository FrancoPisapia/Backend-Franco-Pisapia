import jwt from 'jsonwebtoken'

const PrivateKey = 'CoderTokenFP';

/* Generamos el token
El primer argumento es un objeto con la info
El segundo argumento es la llave privada con la que se hará el cifrado
El tercer argumento el tiempo de experiacion del token
 */

export const generateToken = (user) =>{
    const token = jwt.sign({user},PrivateKey,{expiresIn:'24h'});
    return token
}

export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader) return res.status(401).send({ error: 'Not authenticated' });
  
    const token = authHeader.split(' ')[1];
    jwt.verify(token, PrivateKey, (error, credentials) => {
      if (error) return res.status(403).send({ error: 'Not authorized' });
  
      req.user = credentials.user;
  
      next();
    });
  };