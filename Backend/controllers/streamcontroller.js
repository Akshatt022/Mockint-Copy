const { Stream, validateStream } = require('../models/stream');
const { Subject } = require('../models/Subject');

// Get all active streams
const getAllStreams = async (req, res) => {
  try {
    const streams = await Stream.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json(streams);
  } catch (error) {
    console.error('Error fetching streams:', error);
    res.status(500).json({ error: 'Failed to fetch streams' });
  }
};

// Get stream by ID with subjects
const getStreamById = async (req, res) => {
  try {
    const stream = await Stream.findById(req.params.id);
    if (!stream) {
      return res.status(404).json({ error: 'Stream not found' });
    }

    const subjects = await Subject.find({ stream: req.params.id, isActive: true }).sort({ name: 1 });
    
    res.status(200).json({
      stream,
      subjects
    });
  } catch (error) {
    console.error('Error fetching stream:', error);
    res.status(500).json({ error: 'Failed to fetch stream' });
  }
};

// Create new stream (Admin only)
const createStream = async (req, res) => {
  try {
    const { error } = validateStream(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const existingStream = await Stream.findOne({ name: req.body.name });
    if (existingStream) {
      return res.status(409).json({ error: 'Stream already exists' });
    }

    const stream = new Stream(req.body);
    await stream.save();
    
    res.status(201).json(stream);
  } catch (error) {
    console.error('Error creating stream:', error);
    res.status(500).json({ error: 'Failed to create stream' });
  }
};

// Update stream (Admin only)
const updateStream = async (req, res) => {
  try {
    const { error } = validateStream(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const stream = await Stream.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!stream) {
      return res.status(404).json({ error: 'Stream not found' });
    }

    res.status(200).json(stream);
  } catch (error) {
    console.error('Error updating stream:', error);
    res.status(500).json({ error: 'Failed to update stream' });
  }
};

// Delete stream (Admin only)
const deleteStream = async (req, res) => {
  try {
    const stream = await Stream.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!stream) {
      return res.status(404).json({ error: 'Stream not found' });
    }

    res.status(200).json({ message: 'Stream deactivated successfully' });
  } catch (error) {
    console.error('Error deleting stream:', error);
    res.status(500).json({ error: 'Failed to delete stream' });
  }
};

module.exports = {
  getAllStreams,
  getStreamById,
  createStream,
  updateStream,
  deleteStream
};