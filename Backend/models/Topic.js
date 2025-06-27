const mongoose = require('mongoose');
const Joi = require('joi');

const TopicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  // stream removed - can be derived from subject relationship
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Compound index for unique topic names within each subject
TopicSchema.index({ name: 1, subject: 1 }, { unique: true });

const topicJoiSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  subject: Joi.string().required(),
  description: Joi.string().max(500).allow('', null),
  isActive: Joi.boolean()
});

const validateTopic = (topic) => topicJoiSchema.validate(topic);

const Topic = mongoose.model('Topic', TopicSchema);

module.exports = { Topic, validateTopic };