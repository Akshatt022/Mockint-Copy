const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Schema
const TopicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
    trim: true
  },
  stream: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stream",
    required: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Joi Schema for validation
const topicJoiSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  stream: Joi.string().required(), // Expecting ObjectId as string
  description: Joi.string().max(500).allow("", null)
});

// Joi Validator
const validateTopic = (topic) => topicJoiSchema.validate(topic);

const Topic = mongoose.model("Topic", TopicSchema);

module.exports = {
  Topic,
  validateTopic
};
