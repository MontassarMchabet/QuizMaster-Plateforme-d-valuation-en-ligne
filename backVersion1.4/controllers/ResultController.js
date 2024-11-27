const Result = require('../model/Result');
const Quiz = require('../model/Quiz');
const Reponse = require('../model/reponse');
const User = require('../model/user')
const quiz = require('../model/Quiz');
const { default: mongoose } = require('mongoose');
const SubmitResult  = async (req, res) => {
  const { studentId, quizId, answers,emotion,timeSpent } = req.body;
  let score = 0;
  
  answers.forEach((answer) => {
    if (answer.isCorrect) {
      score += 1;
    }
  });

  const submission = new Result({
    studentId,
    quizId,
    answers: answers,
    score,
    emotion:emotion,
    timeSpent:timeSpent,
    submittedAt: new Date(),
  });
  
  await submission.save();

  res.status(201).json(score);
};
const SavedReponse  = async (req, res)  => {
  const { studentId, quizId, questionId, answer,isCorrect, timeSpent } = req.body;
  try {
      const newReponse = new Reponse({
          studentId,
          quizId,
          questionId,
          answer,
          isCorrect,
          timeSpent
      });
      await newReponse.save();
      res.status(201).json(newReponse);
  } catch (err) {
      res.status(500).json({ error: 'Erreur lors de la soumission de la réponse' });
  }
};
const getAllResultsByStudentID = async (req, res) => {
  try {
      const { id } = req.params;
  
      const Results = await Result.find({ studentId: mongoose.Types.ObjectId(id) }).populate('quizId').populate('answers');

    
      res.status(200).json(Results);
  } catch (error) {
      console.error(error);
      res.status(500).send('Erreur lors de la récupération des quizzes');
  }
};
const getResultById = async (req, res) => {
  const { id } = req.params;
 
  try {
      const result = await Result.findById(id).populate('quizId').populate('answers');
      if (!result) {
          return res.status(404).send('Quiz non trouvé');
      }
      res.status(200).json(result);
  } catch (error) {
      console.error(error);
      res.status(500).send('Erreur lors de la récupération des questions');
  }
};
const GetDetailsByStudentd = async (req, res) => {
  try {
    const { id } = req.params;

    // Trouver l'étudiant en fonction de son ID
    const student = await User.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Étudiant non trouvé" });
    }

    // Trouver tous les résultats de l'étudiant
    const studentResults = await Result.find({ studentId: mongoose.Types.ObjectId(id) }).populate('quizId');
    
    let totalScore = 0;
    let totalQuizTime = 0;
    let progressData = [];
    let emotionalData = [];
    let totalQuestions = 0;

    if (studentResults.length > 0) {
      for (const result of studentResults) {
        const quiz = result.quizId;
        const numberOfQuestions = quiz.questions.length;

        totalScore += result.score;
        totalQuestions += numberOfQuestions;

        // Simuler un temps moyen passé sur chaque quiz (vous pouvez l'ajuster en fonction de vos données)
       
        const timeSpentInMinutes = result.timeSpent / 60;
        totalQuizTime += timeSpentInMinutes;
        // Ajouter les données de progression par quiz
        progressData.push({
          quiz: quiz.title, // Assurez-vous que le modèle Quiz a un champ `title`
          score: (result.score / numberOfQuestions) * 100, 
          averageTime: timeSpentInMinutes.toFixed(2),
        });

        // Ajouter les données émotionnelles (simulées ici)
        emotionalData.push({
          quiz: quiz.title,
          confidence: Math.floor(Math.random() * 30) + 60, // Simuler une confiance entre 60 et 90%
          stress: Math.floor(Math.random() * 20) + 10, // Simuler un stress entre 10 et 30%
        });
      }
      
      // Calculer la progression (premier et dernier score de progressData)
      let progression = 0;
      if (progressData.length > 1) {
        const firstScore = progressData[0].score;
        const lastScore = progressData[progressData.length - 1].score;
        progression = ((lastScore - firstScore) / firstScore * 100).toFixed(1);
      }
      // Calcul de la moyenne des scores en pourcentage
      const averageScore = totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0;

      // Structure de données de l'étudiant
      const studentData = {
        name: student.fullName,
        email: student.email,
        picture:student.profilePicture,
        quizzesTaken: studentResults.length,
        averageScore: averageScore,
        totalQuizTime: totalQuizTime.toFixed(2),
        avatar: "/placeholder.svg?height=100&width=100", // Remplacer par le chemin réel de l'avatar
        progressData: progressData,
        emotionalData: emotionalData,
        progression: progression,
      };
      
      // Envoyer la réponse avec les détails de l'étudiant
      res.status(200).json(studentData);
    } else {
      res.status(404).json({ message: "Aucun quiz trouvé pour cet étudiant" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la récupération des résultats de l\'étudiant');
  }
};

const TeacherDashbord = async (req, res) => {
  try {
    // Récupérer tous les étudiants et les quizs
    const students = await User.find({ role: 'client' }); // Filtrer uniquement les étudiants
    const quizzes = await quiz.find();

    // Récupérer tous les résultats et les peupler avec les détails du quiz
    const studentResults = await Result.find().populate('quizId');

    // Vérifier s'il y a des résultats pour éviter la division par zéro
    if (studentResults.length === 0) {
      return res.status(200).json({
        StudentLength: students.length,
        QuizLength: quizzes.length,
        ScoreAVG: 0,
        progressData: [],
        message: 'Aucun résultat trouvé'
      });
    }

    let totalScore = 0;
    const quizScores = {};

    // Regrouper les scores par quiz
    for (const result of studentResults) {
      const quiz = result.quizId;

      // Vérifier que le quiz et ses questions existent
      if (quiz && quiz.questions && quiz.questions.length > 0) {
        const numberOfQuestions = quiz.questions.length;
        const scorePercentage = (result.score / numberOfQuestions) * 100;

        if (!quizScores[quiz.title]) {
          quizScores[quiz.title] = {
            totalScore: 0,
            count: 0
          };
        }

        quizScores[quiz.title].totalScore += scorePercentage;
        quizScores[quiz.title].count += 1;
        totalScore += result.score;
      }
    }

    // Calculer le score moyen par quiz
    const progressData = Object.keys(quizScores).map((quizTitle) => {
      const { totalScore, count } = quizScores[quizTitle];
      return {
        quiz: quizTitle,
        score: (totalScore / count).toFixed(2) // Score moyen arrondi à 2 décimales
      };
    });

    // Structure de données de l'étudiant
    const studentData = {
      StudentLength: students.length,
      QuizLength: quizzes.length,
      ScoreAVG: (totalScore / studentResults.length).toFixed(2), // Score moyen global arrondi
      progressData, // Inclusion des données de progression
    };

    // Envoyer la réponse avec les détails de l'étudiant
    res.status(200).json(studentData);

  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la récupération des résultats de l'étudiant");
  }
};



const GetAvrgScoreByStudentd = async (req, res) => {
  try {
    // Récupérer tous les utilisateurs de rôle 'client' et qui sont vérifiés
    const students = await User.find({ role: 'client', verified: true });

    // Tableau pour stocker les résultats des étudiants avec leurs scores moyens
    let studentScores = [];

    // Parcourir chaque étudiant
    for (const student of students) {
      // Trouver les résultats de cet étudiant
      const studentResults = await Result.find({ studentId: mongoose.Types.ObjectId(student._id) }).populate({
        path: 'quizId',
        select: 'questions'  // On ne sélectionne que les questions du quiz
      });

      let totalScore = 0;
      let totalQuestions = 0;

      // Parcourir les résultats de cet étudiant pour calculer son score moyen
      for (const result of studentResults) {
        const quiz = result.quizId;
        
        // Vérifier si le quiz a des questions
        if (quiz && quiz.questions && quiz.questions.length > 0) {
          const numberOfQuestions = quiz.questions.length;
          totalScore += result.score;
          totalQuestions += numberOfQuestions;
        }
      }

      // Calculer la moyenne des scores en pourcentage pour cet étudiant
      const averageScore = totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0;

      // Ajouter le résultat de cet étudiant au tableau
      studentScores.push({
        studentId: student._id,
        fullName: student.fullName,
        email: student.email,
        averageScore: averageScore,
        nbPassedQuizzes: studentResults.length
      });
    }

    // Envoyer la réponse avec les scores moyens pour chaque étudiant
    res.status(200).json(studentScores);
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la récupération des scores des étudiants');
  }
};

  module.exports = {
    SavedReponse,SubmitResult,getAllResultsByStudentID,getResultById,GetAvrgScoreByStudentd,GetDetailsByStudentd,TeacherDashbord
  };