const mongoose = require('mongoose');
const Joi = require('joi');

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  stream: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stream',
    required: true
  },
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

// Compound index to ensure unique subject names within each stream
SubjectSchema.index({ name: 1, stream: 1 }, { unique: true });

const subjectJoiSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  stream: Joi.string().required(),
  description: Joi.string().max(500).allow('', null),
  isActive: Joi.boolean()
});

const validateSubject = (subject) => subjectJoiSchema.validate(subject);

const Subject = mongoose.model('Subject', SubjectSchema);

module.exports = { Subject, validateSubject };