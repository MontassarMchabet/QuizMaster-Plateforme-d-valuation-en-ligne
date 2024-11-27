const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    type: {
        type: String,
        enum: ['multiple_choice', 'image', 'drag_and_drop', 'short_answer'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    options: [{
        type: String,
        required: true
    }],
    correctAnswer: {
        type: String,
        required: true
    },
    media: {
        type: String  // URL ou chemin vers le média
    },
    hints: [{
        type: String  // Indices, par exemple "50/50" options
    }],
    maxHints: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        required: true
    },
    timeSpent: {
        type: Number,
        default: 0  // Temps passé sur cette question en secondes
    },
    attempts: {
        type: Number,
        default: 0  // Nombre de tentatives pour cette question
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    dragOptions: [String] 
});

module.exports = mongoose.model('Question', questionSchema);
