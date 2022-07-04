const multer = require('multer');
// image upload 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/images')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
});

const upload = multer({ storage: storage });

module.exports = upload;