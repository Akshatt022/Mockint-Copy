const mongoose = require('mongoose');
const Joi = require('joi');

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 500,
    trim: true
  },
  options: {
    type: [String],
    validate: {
      validator: function(arr) {
        return arr.length === 4;
      },
      message: 'Exactly 4 options are required'
    },
    required: true
  },
  correctOption: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        return this.options.includes(value);
      },
      message: 'Correct option must be one of the provided options'
    }
  },
  stream: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stream',
    required: true,
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  }
}, { timestamps: true });

// Joi validation schema for Question
const questionJoiSchema = Joi.object({
  question: Joi.string().min(5).max(500).required(),
  options: Joi.array().items(Joi.string()).length(4).required(),
  correctOption: Joi.string().required(),
  stream: Joi.string().required(),  // expect ObjectId string
  topic: Joi.string().required(),   // expect ObjectId string
  difficulty: Joi.string().valid('Easy', 'Medium', 'Hard').required()
});

// Validation function
const validateQuestion = (question) => {
  return questionJoiSchema.validate(question);
};

const Question = mongoose.model('Question', QuestionSchema);

module.exports = {
  Question,
  validateQuestion
};
