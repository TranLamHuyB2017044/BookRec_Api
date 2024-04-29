const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});


// const Productstorage = new CloudinaryStorage({
//   cloudinary,
//   allowedFormats: ['jpg', 'png'],
//   params: {
//     folder: 'product_img',
//   },
// });
// const ProductVideo = new CloudinaryStorage({
//   cloudinary,
//   allowedFormats: ['mp3', 'mp4', 'avi', 'mov'],
//   params: {
//     folder: 'video_product',
//     resource_type: 'video'
//   },
// });

const anyUpload = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['mp3', 'mp4', 'avi', 'mov', 'jpg', 'png', 'jpeg'],
  params: {
    folder: 'rating_asset',
    resource_type: 'auto',
  },

});
const anyUpload_product = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['mp3', 'mp4', 'avi', 'mov', 'jpg', 'png', 'jpeg'],
  params: {
    folder: 'product_img',
    resource_type: 'auto',
  },

});



const uploadCloud = {
  // imgUpload: multer({ storage: Productstorage }),
  // videoUpload : multer({ storage: ProductVideo }),
  anyUpload:multer({ storage: anyUpload }),
  anyUpload_product:multer({ storage: anyUpload_product }),
};



module.exports = uploadCloud;
