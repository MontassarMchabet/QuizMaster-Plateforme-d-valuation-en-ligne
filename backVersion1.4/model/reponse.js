const mongoose = require('mongoose');

 

const reponseSchema = new mongoose.Schema({
    studentId: {   // Ajout pour identifier l'étudiant
        type: mongoose.Types.ObjectId,
        ref: "User",  // Supposez que vous avez un modèle User
        required: true
    },
    questionId :{
        type:mongoose.Types.ObjectId,
        ref:"Question"
    },
    quizId :{
        type:mongoose.Types.ObjectId,
        ref:"Question"
    },

   answer: {
        type: Object,
        default: {}
    },
    isCorrect:{
        type: Boolean,
        default:false 
    },
    timeSpent: {  // Temps passé sur cette question en secondes
        type: Number,
        default: 0
    },
    createdAt: {  // Date de création pour traquer la réponse
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Reponse', reponseSchema);