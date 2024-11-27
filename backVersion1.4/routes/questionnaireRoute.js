// questionnaire.route.js
const express = require('express');
const router = express.Router();
const questionnaireController = require('../controllers/questionnairController');

// Créer une question
router.post('/question', questionnaireController.createQuestion);

// Obtenir toutes les questions
router.get('/questions', questionnaireController.getAllQuestions);

module.exports = router;
