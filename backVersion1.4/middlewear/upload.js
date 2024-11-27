const multer = require("multer")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
  const uniqueSuffix = Date.now() + '-' + file.originalname   
  cb(null, file.fieldname + '-' + file.originalname)
    
  } 
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg") {
      cb(null, true)
    }
    else {
      cb(new Error("fichier incompatible"))
    }
  }
})


module.exports = upload 


/* const multer = require('multer')
const path = require('path')
// 8. Upload Image Controller
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './storages')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage,
    limits: { fileSize: '1000000' },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif|pdf/
        const mimeType = fileTypes.test(file.mimetype)  
        const extname = fileTypes.test(path.extname(file.originalname))
        if(mimeType && extname) {
            return cb(null, true)
        }
        cb('Give proper files formate to upload')
    }
})

module.exports = upload  


/* const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Le dossier où les fichiers téléchargés seront stockés
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Renommer le fichier pour éviter les doublons
  }
});

const upload = multer({ storage: storage });

module.exports = upload; */