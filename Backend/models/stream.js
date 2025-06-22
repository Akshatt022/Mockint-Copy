const mongoose = require('mongoose');

const StreamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  }
}, { timestamps: true });


const Stream = mongoose.model('Stream', StreamSchema);

module.exports = Stream;

