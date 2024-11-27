const mongoose = require('mongoose');
const Quiz = require('../model/Quiz');
const Question = require('../model/Question');

const createQuiz = async (req, res) => {
    const { title, description, teacherId, duration, questions } = req.body;

    // Validation des champs requis
    if (!title || !teacherId || !duration || !questions || questions.length === 0) {
        return res.status(400).send('Tous les champs requis doivent être remplis.');
    }

    try {
        // Créer un nouveau quiz
        const quiz = new Quiz({
            title,
            description,
            teacherId,
            duration
        });

        // Sauvegarder le quiz pour obtenir son ID
        await quiz.save();

        // Ajouter les questions
        const questionIds = [];
        let MaxH = 0;
        for (let i = 0; i < questions.length; i++) {
           
            const questionData = questions[i];
            const hasHints = questionData.hints && questionData.hints.length > 0;
            if(hasHints){
               
                MaxH++;
            }
            const question = new Question({
                quizId: quiz._id,
                type: questionData.type,
                content: questionData.content,
                options: questionData.options,
                correctAnswer: questionData.correctAnswer,
                media: questionData.media,
                hints: questionData.hints,
                dragOptions: questionData.dragOptions,
                maxHints: hasHints,
                order: i + 1 // Numéro de la question dans l'ordre
            });

            // Sauvegarder chaque question et collecter les IDs
            await question.save();
            questionIds.push(question._id);
        }

        // Associer les questions au quiz
        quiz.questions = questionIds;
        quiz.maxH = MaxH;

        // Mettre à jour le quiz avec les questions associées
        await quiz.save();

        res.status(201).json({ message: 'Quiz créé avec succès', quiz });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la création du quiz');
    }
};

const getAllQuizzes = async (req, res) => {
  try {
      // Récupérer tous les quizzes, y compris les questions associées
      const quizzes = await Quiz.find().populate('questions');

      // Vérifier si des quizzes existent
      if (!quizzes || quizzes.length === 0) {
          return res.status(404).send('Aucun quiz trouvé');
      }

      // Envoyer la liste des quizzes en réponse
      res.status(200).json(quizzes);
  } catch (error) {
      console.error(error);
      res.status(500).send('Erreur lors de la récupération des quizzes');
  }
};
const getQuestionsByQuiz = async (req, res) => {
  const { quizId } = req.params;

  try {
      const quiz = await Quiz.findById(quizId).populate('questions');
      if (!quiz) {
          return res.status(404).send('Quiz non trouvé');
      }
      res.status(200).json(quiz.questions);
  } catch (error) {
      console.error(error);
      res.status(500).send('Erreur lors de la récupération des questions');
  }
};
const deleteQuiz = async (req, res) => {
  const { quizId } = req.params;

  try {
      // Supprimer les questions associées (optionnel, selon votre logique)
      await Question.deleteMany({ quizId });

      const quiz = await Quiz.findByIdAndDelete(quizId);
      if (!quiz) {
          return res.status(404).send('Quiz non trouvé');
      }

      res.status(200).send('Quiz supprimé avec succès');
  } catch (error) {
      console.error(error);
      res.status(500).send('Erreur lors de la suppression du quiz');
  }
};
const addQuestion = async (req, res) => {
  const { quizId } = req.params;
  const { type, content, options, correctAnswer, media, hints, maxHints,dragOptions,order } = req.body;

  try {
      const question = new Question({
          quizId,
          type,
          content,
          options,
          correctAnswer,
          media,
          hints,
          maxHints,
          dragOptions,
          order:1,
      });

      await question.save();
      console.log(question);
      console. log(quizId)
       // Ajouter la question au quiz
           // Ajout de la question au quiz en utilisant findByIdAndUpdate
           const updatedQuiz = await Quiz.findByIdAndUpdate(question.quizId
            ,
            { $push: { questions: question._id } },
            { new: true } // Retourne la version mise à jour du document
        );
  
        if (!updatedQuiz) {
            return res.status(404).send('Quiz non trouvé');
        }
  

      res.status(201).json(question);
  } catch (error) {
      console.error(error);
      res.status(500).send('Erreur lors de l’ajout de la question');
  }
};
const updateQuestion = async (req, res) => {
  const { questionId } = req.params;
  const { content, options, correctAnswer, media, hints, maxHints,dragOptions } = req.body;

  try {
      const question = await Question.findByIdAndUpdate(
          questionId,
          { content, options, correctAnswer, media, hints, maxHints, updatedAt: Date.now(),dragOptions },
          { new: true }
      );

      if (!question) {
          return res.status(404).send('Question non trouvée');
      }

      res.status(200).json(question);
  } catch (error) {
      console.error(error);
      res.status(500).send('Erreur lors de la mise à jour de la question');
  }
};

const deleteQuestion = async (req, res) => {
  const { questionId } = req.params;

  try {
      const question = await Question.findByIdAndDelete(questionId);
      if (!question) {
          return res.status(404).send('Question non trouvée');
      }

      // Supprimer la question du quiz
      await Quiz.findByIdAndUpdate(question.quizId, { $pull: { questions: questionId } });

      res.status(200).send('Question supprimée avec succès');
  } catch (error) {
      console.error(error);
      res.status(500).send('Erreur lors de la suppression de la question');
  }
};
const getQuizById = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId); 

    if (!quiz) {
        return res.status(404).json({ message: 'Quiz non trouvé' });
    }

    res.status(200).json(quiz); // Retourne le quiz trouvé
} catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération du quiz', error: err.message });
}
};
const updateQuiz = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const { title, description, duration, questions } = req.body;

    const updatedQuiz = await Quiz.findByIdAndUpdate(
        quizId,
        { title, description, duration, questions },
        { new: true } // Retourne le quiz mis à jour
    );

    if (!updatedQuiz) {
        return res.status(404).json({ message: 'Quiz non trouvé' });
    }

    res.status(200).json(updatedQuiz); // Retourne le quiz mis à jour
} catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du quiz', error: err.message });
}
};

module.exports = { createQuiz,getQuestionsByQuiz,deleteQuiz,addQuestion,updateQuestion,deleteQuestion,getAllQuizzes,updateQuiz,getQuizById };
