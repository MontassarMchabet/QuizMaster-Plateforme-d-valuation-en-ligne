const express = require('express');
const router = express.Router();
const reponseController = require('../controllers/ResultController');

 router.post('/submitquiz', reponseController.SubmitResult);
 router.post('/submitReponse', reponseController.SavedReponse);
 router.get('/getAllResultsbyId/:id', reponseController.getAllResultsByStudentID);
 router.get('/getResultById/:id', reponseController.getResultById);
 router.get('/GetAvrgScoreByStudentd', reponseController.GetAvrgScoreByStudentd);
 router.get('/GetDetailsByStudentd/:id', reponseController.GetDetailsByStudentd);
 router.get('/TeacherDashbord', reponseController.TeacherDashbord);
module.exports = router;
