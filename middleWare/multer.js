const multer = require('multer');

// Allowed file types
const allowedFileTypes = ['image/jpeg', 'image/png', 'image/webp'];

// Configure Multer Storage (store file in memory before upload)
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP are allowed.'), false);
  }
};

// Multer upload instance for multiple files (max: 5)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
});

module.exports = upload;
