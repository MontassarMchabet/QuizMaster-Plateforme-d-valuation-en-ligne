const { string } = require('joi');
const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    },
    answers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reponse'
    }],
    score: {
        type: Number,
        default: 0  
    },
    emotion: {  
        type: String
       
    },timeSpent: {  // Temps passé sur cette quiz 
        type: Number,
        default: 0
    }
    ,
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Result', ResultSchema);
