const route = require("express").Router()
const auth=require("../controllers/auth_controller")
const admin=require('../controllers/adminController')
const multer = require('multer');

// Initialiser multer pour l'upload d'images
const upload = multer({ dest: 'uploads/' });
route.post("/registerClient",auth.registerClient)
route.get("/verify-email",auth.sendVerificationMail)
route.post('/login', auth.loginWithEmail);
route.get("/UnverifiedProfs",admin.getUnverifiedProfs)
route.get("/verifiedProfs",admin.getverifiedProfs)
route.get("/verifiedclients",admin.getverifiedclients)
route.get("/getUserById/:userId",admin.getUserById)
route.put("/updateTeacherVerification/:id",admin.updateTeacherVerification)
route.put('/updateUser/:id', upload.single('profilePicture'),auth.updateetudiant)


module.exports=route