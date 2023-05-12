import bcrypt from 'bcrypt'


//*****Hassheo ******/

export const createHash = password =>bcrypt.hashSync(password,bcrypt.genSaltSync(10));


export const isValidPassword = (user,password) =>bcrypt.compareSync(password,user.password)