const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
    duration: {
        type: Number,  // Durée en minutes
        required: true
    },
    maxH: {
        type: Number,
        default: 0  // Nombre de tentatives réalisées par les étudiants
    },
    attemptCount: {
        type: Number,
        default: 0  // Nombre de tentatives réalisées par les étudiants
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Quiz', quizSchema);
