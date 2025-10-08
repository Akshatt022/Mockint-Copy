const mongoose = require('mongoose');
const Joi = require('joi');

const StreamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  resourceType: {
    type: String,
    enum: ['pdf', 'link'],
    set: (value) => (value === null || value === '' ? undefined : value)
  },
  resourceTitle: {
    type: String,
    trim: true,
    maxlength: 120,
    set: (value) => (value === null || value === '' ? undefined : value)
  },
  resourceUrl: {
    type: String,
    trim: true,
    maxlength: 500,
    set: (value) => (value === null || value === '' ? undefined : value)
  },
  resourceDescription: {
    type: String,
    trim: true,
    maxlength: 500,
    set: (value) => (value === null || value === '' ? undefined : value)
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const streamJoiSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  description: Joi.string().max(500).allow('', null),
  resourceType: Joi.string().valid('pdf', 'link').allow(null),
  resourceTitle: Joi.string().max(120).allow('', null),
  resourceUrl: Joi.string().uri({ allowRelative: true }).max(500).allow('', null),
  resourceDescription: Joi.string().max(500).allow('', null),
  isActive: Joi.boolean()
});

const validateStream = (stream) => streamJoiSchema.validate(stream);

const Stream = mongoose.model('Stream', StreamSchema);

module.exports = { Stream, validateStream };
