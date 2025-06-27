const mongoose = require('mongoose');
const Joi = require('joi');

const TestResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stream: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stream',
    required: true
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  topics: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic'
  }],
  totalQuestions: {
    type: Number,
    required: true
  },
  answeredQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  wrongAnswers: {
    type: Number,
    required: true
  },
  skippedQuestions: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  timeTaken: {
    type: Number, // in minutes
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Mixed'],
    required: true
  },
  answers: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    selectedOption: {
      type: Number, // index of selected option
      default: -1 // -1 means not answered
    },
    isCorrect: {
      type: Boolean,
      required: true
    },
    timeTaken: {
      type: Number // time taken for this question in seconds
    }
  }],
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  }
}, { timestamps: true });

// Data integrity validations
TestResultSchema.pre('save', function(next) {
  // Validate that answeredQuestions = correctAnswers + wrongAnswers
  if (this.answeredQuestions !== (this.correctAnswers + this.wrongAnswers)) {
    return next(new Error('answeredQuestions must equal correctAnswers + wrongAnswers'));
  }
  
  // Validate that endTime > startTime
  if (this.endTime <= this.startTime) {
    return next(new Error('endTime must be after startTime'));
  }
  
  // Validate percentage calculation
  const calculatedPercentage = this.totalQuestions > 0 
    ? Math.round((this.correctAnswers / this.totalQuestions) * 100) 
    : 0;
  
  if (Math.abs(this.percentage - calculatedPercentage) > 1) {
    return next(new Error('percentage calculation is incorrect'));
  }
  
  next();
});

// Indexes for performance
TestResultSchema.index({ user: 1, createdAt: -1 });
TestResultSchema.index({ stream: 1 });
TestResultSchema.index({ subject: 1 });
TestResultSchema.index({ startTime: 1 });
TestResultSchema.index({ completionTime: 1 });

const testResultJoiSchema = Joi.object({
  user: Joi.string().required(),
  stream: Joi.string().required(),
  subjects: Joi.array().items(Joi.string()),
  topics: Joi.array().items(Joi.string()),
  totalQuestions: Joi.number().min(1).required(),
  answeredQuestions: Joi.number().min(0).required(),
  correctAnswers: Joi.number().min(0).required(),
  wrongAnswers: Joi.number().min(0).required(),
  skippedQuestions: Joi.number().min(0).required(),
  score: Joi.number().min(0).required(),
  percentage: Joi.number().min(0).max(100).required(),
  timeTaken: Joi.number().min(0).required(),
  difficulty: Joi.string().valid('Easy', 'Medium', 'Hard', 'Mixed').required(),
  answers: Joi.array().items(
    Joi.object({
      question: Joi.string().required(),
      selectedOption: Joi.number().min(-1),
      isCorrect: Joi.boolean().required(),
      timeTaken: Joi.number().min(0)
    })
  ),
  startTime: Joi.date().required(),
  endTime: Joi.date().required()
});

const validateTestResult = (result) => testResultJoiSchema.validate(result);

const TestResult = mongoose.model('TestResult', TestResultSchema);

module.exports = { TestResult, validateTestResult };