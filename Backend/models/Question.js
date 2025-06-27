const mongoose = require('mongoose');
const Joi = require('joi');

const QuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 1000
  },
  options: [{
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    isCorrect: {
      type: Boolean,
      default: false
    }
  }],
  explanation: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  stream: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stream',
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, { timestamps: true });

// Indexes for performance
QuestionSchema.index({ stream: 1, subject: 1, topic: 1 });
QuestionSchema.index({ difficulty: 1 });
QuestionSchema.index({ isActive: 1 });
QuestionSchema.index({ createdBy: 1 });
QuestionSchema.index({ createdAt: -1 });

// Validation to ensure exactly one correct answer
QuestionSchema.pre('save', function(next) {
  const correctAnswers = this.options.filter(option => option.isCorrect);
  if (correctAnswers.length !== 1) {
    return next(new Error('Question must have exactly one correct answer'));
  }
  next();
});

const questionJoiSchema = Joi.object({
  questionText: Joi.string().min(10).max(1000).required(),
  options: Joi.array().items(
    Joi.object({
      text: Joi.string().max(500).required(),
      isCorrect: Joi.boolean().required()
    })
  ).min(2).max(6).required(),
  explanation: Joi.string().max(1000).allow('', null),
  difficulty: Joi.string().valid('Easy', 'Medium', 'Hard').required(),
  stream: Joi.string().required(),
  subject: Joi.string().required(),
  topic: Joi.string().required(),
  isActive: Joi.boolean(),
  createdBy: Joi.string()
});

const validateQuestion = (question) => questionJoiSchema.validate(question);

const Question = mongoose.model('Question', QuestionSchema);

module.exports = { Question, validateQuestion };