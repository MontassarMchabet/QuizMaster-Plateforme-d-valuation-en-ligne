const route = require("express").Router()
const etudiant=require('../controllers/etudiantController')
route.post('/',etudiant.createetudiant)
route.get('/',etudiant.getetudiants)
route.get('/:id',etudiant.getAdmByID)
route.delete('/:id',etudiant.deleteetudiant)

module.exports=route