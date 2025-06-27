const { Question, validateQuestion } = require('../models/Question');
const { Stream } = require('../models/stream');
const { Subject } = require('../models/Subject');
const { Topic } = require('../models/Topic');

// Get all questions with filters (Admin)
const getAllQuestions = async (req, res) => {
  try {
    // Use validated pagination and filters from middleware if available
    const { page, limit } = req.pagination || { 
      page: parseInt(req.query.page) || 1, 
      limit: parseInt(req.query.limit) || 20 
    };
    
    const { streamId, subjectId, topicId, difficulty, search } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    let query = { isActive: true };
    
    if (streamId) query.stream = streamId;
    if (subjectId) query.subject = subjectId;
    if (topicId) query.topic = topicId;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.questionText = { $regex: search, $options: 'i' };
    }

    const questions = await Question.find(query)
      .populate('stream', 'name')
      .populate('subject', 'name')
      .populate('topic', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Question.countDocuments(query);

    res.status(200).json({
      questions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
};

// Get question by ID (Admin)
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('stream', 'name')
      .populate('subject', 'name')
      .populate('topic', 'name');

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.status(200).json(question);
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ error: 'Failed to fetch question' });
  }
};

// Create new question (Admin)
const createQuestion = async (req, res) => {
  try {
    const { error } = validateQuestion(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Verify stream, subject, and topic exist and are related
    const stream = await Stream.findById(req.body.stream);
    if (!stream) {
      return res.status(404).json({ error: 'Stream not found' });
    }

    const subject = await Subject.findOne({ 
      _id: req.body.subject, 
      stream: req.body.stream 
    });
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found or not in the specified stream' });
    }

    const topic = await Topic.findOne({ 
      _id: req.body.topic, 
      subject: req.body.subject,
      stream: req.body.stream
    });
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found or not in the specified subject' });
    }

    // Verify exactly one correct answer
    const correctAnswers = req.body.options.filter(opt => opt.isCorrect);
    if (correctAnswers.length !== 1) {
      return res.status(400).json({ error: 'Question must have exactly one correct answer' });
    }

    const question = new Question({
      ...req.body,
      createdBy: req.admin._id
    });

    await question.save();

    const populatedQuestion = await Question.findById(question._id)
      .populate('stream', 'name')
      .populate('subject', 'name')
      .populate('topic', 'name');

    res.status(201).json(populatedQuestion);

  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Failed to create question' });
  }
};

// Update question (Admin)
const updateQuestion = async (req, res) => {
  try {
    const { error } = validateQuestion(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Verify exactly one correct answer
    const correctAnswers = req.body.options.filter(opt => opt.isCorrect);
    if (correctAnswers.length !== 1) {
      return res.status(400).json({ error: 'Question must have exactly one correct answer' });
    }

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('stream', 'name')
    .populate('subject', 'name')
    .populate('topic', 'name');

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.status(200).json(question);

  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ error: 'Failed to update question' });
  }
};

// Delete question (Admin)
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.status(200).json({ message: 'Question deactivated successfully' });

  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: 'Failed to delete question' });
  }
};

// Bulk upload questions (Admin)
const bulkUploadQuestions = async (req, res) => {
  try {
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: 'Questions array is required' });
    }

    const validQuestions = [];
    const errors = [];

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const { error } = validateQuestion(questions[i]);
      if (error) {
        errors.push(`Question ${i + 1}: ${error.details[0].message}`);
        continue;
      }

      // Verify exactly one correct answer
      const correctAnswers = questions[i].options.filter(opt => opt.isCorrect);
      if (correctAnswers.length !== 1) {
        errors.push(`Question ${i + 1}: Must have exactly one correct answer`);
        continue;
      }

      validQuestions.push({
        ...questions[i],
        createdBy: req.admin._id
      });
    }

    if (errors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation errors found',
        errors
      });
    }

    // Insert valid questions
    const insertedQuestions = await Question.insertMany(validQuestions);

    res.status(201).json({
      message: `${insertedQuestions.length} questions uploaded successfully`,
      questions: insertedQuestions
    });

  } catch (error) {
    console.error('Error bulk uploading questions:', error);
    res.status(500).json({ error: 'Failed to upload questions' });
  }
};

module.exports = {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  bulkUploadQuestions
};