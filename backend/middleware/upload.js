const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ppdb_cikembulan_docs',
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
    // untuk file pdf format harus diset raw jika menggunakan multer-storage-cloudinary v4
    // tapi kita coba basic dulu
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
