import bcrypt from 'bcrypt'


//*****Hassheo ******/

export const createHash = async password =>bcrypt.hashSync(password,bcrypt.genSaltSync(10));


export const isValidPassword = (password, hash) => {
    if (!hash) {
      return false;
    }
    return bcrypt.compareSync(password, hash);
  };