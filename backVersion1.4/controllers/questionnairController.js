 const Questionnaire = require('../model/Question');

// Créer une question
 const createQuestion = async (req, res) => {
  try {
    const { question, options, correctOption } = req.body;
    const newQuestion = new Questionnaire({
      question,
      options,
      correctOption,
    });
    await newQuestion.save();
    res.status(201).json({ message: 'Question créée avec succès !', question: newQuestion });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la question', error: error });
  }
};

// Obtenir toutes les questions
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Questionnaire.find();
    res.status(200).json({ questions });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des questions', error: error.message });
  }
};
 
module.exports = { getAllQuestions, createQuestion  }