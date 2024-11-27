const express = require("express");
const connectedToDB = require("./db");
const quizRoutes = require('./routes/quizRoutes');
const path = require('path');
const multer = require('multer');
const cors = require('cors');

 require('dotenv').config()
 
connectedToDB()

const app = express();

app.use(cors());

  
app.use(express.json());
const etudiantRoute=require("./routes/etudiant_route")
const authRoute=require("./routes/auth_route")
const questionnaireRoute= require("./routes/questionnaireRoute")
const adminRoute=require("./routes/admin_route")
const reponseRouter=require("./routes/reponseRouter")

app.use('/quiz', quizRoutes);
app.use('/etudiant',etudiantRoute)
app.use('/auth',authRoute)
app.use('/questionnaire', questionnaireRoute);
app.use('/admin', adminRoute);
app.use('/reponses', reponseRouter);

// Définir le stockage des fichiers avec multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Dossier où l'image sera enregistrée
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Nom unique basé sur l'horodatage et l'extension du fichier
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Initialiser multer avec la configuration du stockage
const upload = multer({ storage: storage });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.listen(process.env.PORT, () => {
  console.log("server listening on port", process.env.PORT)
})