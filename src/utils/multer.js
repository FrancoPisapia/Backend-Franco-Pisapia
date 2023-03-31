//import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, resolve('public'));
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const uploader = multer({ storage });

export default uploader