const Stream = require('../models/stream');

// Create a new Stream
const createStream = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existing = await Stream.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Stream already exists' });
    }

    const stream = new Stream({ name, description });
    await stream.save();

    res.status(201).json(stream);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Streams
const getStreams = async (req, res) => {
  try {
    const streams = await Stream.find().sort('name');
    res.json(streams);
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: error.message });
  }
};

// Get Stream by ID
const getStreamById = async (req, res) => {
  try {
    const stream = await Stream.findById(req.params.id);
    if (!stream) return res.status(404).json({ message: 'Stream not found' });
    res.json(stream);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Stream by ID
const updateStream = async (req, res) => {
  try {
    const { name, description } = req.body;
    const stream = await Stream.findById(req.params.id);

    if (!stream) return res.status(404).json({ message: 'Stream not found' });

    stream.name = name || stream.name;
    stream.description = description || stream.description;

    await stream.save();

    res.json(stream);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Stream by ID
const deleteStream = async (req, res) => {
  try {
    const stream = await Stream.findByIdAndDelete(req.params.id);
    if (!stream) return res.status(404).json({ message: 'Stream not found' });
    res.json({ message: 'Stream deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createStream,
  getStreams,
  getStreamById,
  updateStream,
  deleteStream,
};
