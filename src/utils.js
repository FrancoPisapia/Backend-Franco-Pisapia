import multer from 'multer';

// donde se almacenarán los archivos

const storage = multer.diskStorage({
    //destination hace referencia a donde se almacenaran las cosas
    destination: function(req,file,cb){
        cb(null,__dirname+'/public/img')//Especificamos ruta
    },
    //filename  hace referencia al nombre final que contendrá el archivo
    filename:function(req,file,cb){
        cb(null,file.originalname)//originalname indica que se mantendra el nombre inicial
    }
})
const uploader = multer ({storage});
export default uploader


