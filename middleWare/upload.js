const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinaryConfig = require("../config/cloudinary")
const storage = new CloudinaryStorage({
  cloudinary: cloudinaryConfig,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "jpeg", "png","PNG"],
  },
});

const upload = multer({ storage });

module.exports = upload;
