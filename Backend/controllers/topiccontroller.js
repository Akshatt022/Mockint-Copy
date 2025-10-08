const { Topic, validateTopic } = require('../models/Topic');
const { Subject } = require('../models/Subject');
const { Question } = require('../models/Question');

// Get topics by subject ID
const getTopicsBySubject = async (req, res) => {
  try {
    const topics = await Topic.find({ 
      subject: req.params.subjectId, 
      isActive: true 
    })
    .populate('subject', 'name')
    .sort({ name: 1 });
    
    res.status(200).json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
};

// Get topics by multiple subject IDs
const getTopicsBySubjects = async (req, res) => {
  try {
    const { subjectIds } = req.body;
    
    if (!subjectIds || !Array.isArray(subjectIds)) {
      return res.status(400).json({ error: 'Subject IDs array is required' });
    }

    const topics = await Topic.find({ 
      subject: { $in: subjectIds }, 
      isActive: true 
    })
    .populate('subject', 'name')
    .sort({ name: 1 });
    
    res.status(200).json(topics);
  } catch (error) {
    console.error('Error fetching topics by subjects:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get topic by ID with question count
const getTopicById = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id)
      .populate('subject', 'name');
      
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    const questionCount = await Question.countDocuments({ 
      topic: req.params.id, 
      isActive: true 
    });
    
    res.status(200).json({
      topic,
      questionCount
    });
  } catch (error) {
    console.error('Error fetching topic:', error);
    res.status(500).json({ error: 'Failed to fetch topic' });
  }
};

// Create new topic (Admin only)
const createTopic = async (req, res) => {
  try {
    const { error } = validateTopic(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Verify subject exists
    const subject = await Subject.findById(req.body.subject);
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    const existingTopic = await Topic.findOne({ 
      name: req.body.name, 
      subject: req.body.subject 
    });
    if (existingTopic) {
      return res.status(409).json({ error: 'Topic already exists in this subject' });
    }

    const topic = new Topic(req.body);
    await topic.save();
    
    const populatedTopic = await Topic.findById(topic._id)
      .populate('subject', 'name');
      
    res.status(201).json(populatedTopic);
  } catch (error) {
    console.error('Error creating topic:', error);
    res.status(500).json({ error: 'Failed to create topic' });
  }
};

// Update topic (Admin only)
const updateTopic = async (req, res) => {
  try {
    const { error } = validateTopic(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const topic = await Topic.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('subject', 'name');

    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    res.status(200).json(topic);
  } catch (error) {
    console.error('Error updating topic:', error);
    res.status(500).json({ error: 'Failed to update topic' });
  }
};

// Delete topic (Admin only)
const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    res.status(200).json({ message: 'Topic deactivated successfully' });
  } catch (error) {
    console.error('Error deleting topic:', error);
    res.status(500).json({ error: 'Failed to delete topic' });
  }
};

module.exports = {
  getTopicsBySubject,
  getTopicsBySubjects,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic
};
