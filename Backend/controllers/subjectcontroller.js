const { Subject, validateSubject } = require('../models/Subject');
const { Topic } = require('../models/Topic');
const { Stream } = require('../models/stream');

// Get subjects by stream ID
const getSubjectsByStream = async (req, res) => {
  try {
    const subjects = await Subject.find({ 
      stream: req.params.streamId, 
      isActive: true 
    })
    .populate('stream', 'name')
    .sort({ name: 1 });
    
    res.status(200).json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
};

// Get subject by ID with topics
const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate('stream', 'name');
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    const topics = await Topic.find({ 
      subject: req.params.id, 
      isActive: true 
    }).sort({ name: 1 });
    
    res.status(200).json({
      subject,
      topics
    });
  } catch (error) {
    console.error('Error fetching subject:', error);
    res.status(500).json({ error: 'Failed to fetch subject' });
  }
};

// Create new subject (Admin only)
const createSubject = async (req, res) => {
  try {
    const { error } = validateSubject(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Verify stream exists
    const stream = await Stream.findById(req.body.stream);
    if (!stream) {
      return res.status(404).json({ error: 'Stream not found' });
    }

    const existingSubject = await Subject.findOne({ 
      name: req.body.name, 
      stream: req.body.stream 
    });
    if (existingSubject) {
      return res.status(409).json({ error: 'Subject already exists in this stream' });
    }

    const subject = new Subject(req.body);
    await subject.save();
    
    const populatedSubject = await Subject.findById(subject._id).populate('stream', 'name');
    res.status(201).json(populatedSubject);
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(500).json({ error: 'Failed to create subject' });
  }
};

// Update subject (Admin only)
const updateSubject = async (req, res) => {
  try {
    const { error } = validateSubject(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('stream', 'name');

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    res.status(200).json(subject);
  } catch (error) {
    console.error('Error updating subject:', error);
    res.status(500).json({ error: 'Failed to update subject' });
  }
};

// Delete subject (Admin only)
const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    res.status(200).json({ message: 'Subject deactivated successfully' });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({ error: 'Failed to delete subject' });
  }
};

module.exports = {
  getSubjectsByStream,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
};