const { User } = require('../models/User');
const { adminModel: Admin } = require('../models/admin');
const { Question } = require('../models/Question');
const { TestResult } = require('../models/TestResult');
const { Stream } = require('../models/stream');
const { Subject } = require('../models/Subject');
const { Topic } = require('../models/Topic');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Joi = require('joi');

// Admin login
exports.adminLogin = async (req, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const [userCount, questionCount, testCount, streamCount, subjectCount, topicCount] = await Promise.all([
      User.countDocuments(),
      Question.countDocuments(),
      TestResult.countDocuments(),
      Stream.countDocuments(),
      Subject.countDocuments(),
      Topic.countDocuments()
    ]);

    // Get recent test activity (temporarily disabled due to schema mismatch)
    const recentTests = [];
    // const recentTests = await TestResult.find()
    //   .sort({ createdAt: -1 })
    //   .limit(5)
    //   .populate('user', 'name email')
    //   .populate('topic', 'name');

    // Get user growth data (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      stats: {
        users: userCount,
        questions: questionCount,
        tests: testCount,
        streams: streamCount,
        subjects: subjectCount,
        topics: topicCount
      },
      recentTests,
      userGrowth
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// User Management
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sortBy = 'createdAt', order = 'desc' } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalUsers: count
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('completedTopics', 'name');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's test history
    const testHistory = await TestResult.find({ userId: user._id })
      .populate('topicId', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      user,
      testHistory
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const schema = Joi.object({
      name: Joi.string().min(3),
      email: Joi.string().email(),
      isActive: Joi.boolean(),
      isBlocked: Joi.boolean()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, select: '-password' }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user's test results
    await TestResult.deleteMany({ userId: user._id });
    
    // Delete user
    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Analytics
exports.getAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};
    
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Test performance by topic
    const testPerformance = await TestResult.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$topicId',
          avgScore: { $avg: '$score' },
          totalTests: { $sum: 1 },
          avgTimeTaken: { $avg: '$timeTaken' }
        }
      },
      {
        $lookup: {
          from: 'topics',
          localField: '_id',
          foreignField: '_id',
          as: 'topic'
        }
      },
      { $unwind: '$topic' },
      {
        $project: {
          topicName: '$topic.name',
          avgScore: { $round: ['$avgScore', 2] },
          totalTests: 1,
          avgTimeTaken: { $round: ['$avgTimeTaken', 2] }
        }
      }
    ]);

    // User activity patterns
    const userActivity = await TestResult.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: { $hour: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Stream popularity
    const streamPopularity = await TestResult.aggregate([
      { $match: dateFilter },
      {
        $lookup: {
          from: 'topics',
          localField: 'topicId',
          foreignField: '_id',
          as: 'topic'
        }
      },
      { $unwind: '$topic' },
      {
        $lookup: {
          from: 'subjects',
          localField: 'topic.subjectId',
          foreignField: '_id',
          as: 'subject'
        }
      },
      { $unwind: '$subject' },
      {
        $lookup: {
          from: 'streams',
          localField: 'subject.streamId',
          foreignField: '_id',
          as: 'stream'
        }
      },
      { $unwind: '$stream' },
      {
        $group: {
          _id: '$stream._id',
          streamName: { $first: '$stream.name' },
          testCount: { $sum: 1 }
        }
      },
      { $sort: { testCount: -1 } }
    ]);

    res.json({
      success: true,
      analytics: {
        testPerformance,
        userActivity,
        streamPopularity
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// System Settings
exports.getSystemSettings = async (req, res) => {
  try {
    // In a real app, these would come from a database
    const settings = {
      maintenanceMode: false,
      registrationEnabled: true,
      testDuration: 30, // minutes
      questionsPerTest: 20,
      passingScore: 70, // percentage
      maxLoginAttempts: 5,
      lockoutDuration: 15 // minutes
    };

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSystemSettings = async (req, res) => {
  try {
    // In a real app, save to database
    const settings = req.body;
    
    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Stream Management
exports.getAllStreams = async (req, res) => {
  try {
    const streams = await Stream.find()
      .sort({ name: 1 })
      .lean();

    // Get counts for each stream
    const streamsWithCounts = await Promise.all(
      streams.map(async (stream) => {
        const subjectCount = await Subject.countDocuments({ stream: stream._id });
        const topicCount = await Topic.countDocuments({
          subject: { $in: await Subject.find({ stream: stream._id }).distinct('_id') }
        });
        const questionCount = await Question.countDocuments({
          topic: { $in: await Topic.find({
            subject: { $in: await Subject.find({ stream: stream._id }).distinct('_id') }
          }).distinct('_id') }
        });
        
        return {
          ...stream,
          subjectCount,
          topicCount,
          questionCount
        };
      })
    );

    res.json({
      success: true,
      streams: streamsWithCounts
    });
  } catch (error) {
    console.error('Get streams error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createStream = async (req, res) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required().min(2).max(100),
      description: Joi.string().max(500).allow('', null),
      resourceType: Joi.string().valid('pdf', 'link').allow(null),
      resourceTitle: Joi.string().max(120).allow('', null),
      resourceUrl: Joi.string().uri({ allowRelative: true }).max(500).allow('', null),
      resourceDescription: Joi.string().max(500).allow('', null),
      isActive: Joi.boolean()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const stream = new Stream(req.body);
    await stream.save();

    res.status(201).json({
      success: true,
      stream
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Stream name already exists' });
    }
    console.error('Create stream error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateStream = async (req, res) => {
  try {
    const schema = Joi.object({
      name: Joi.string().min(2).max(100),
      description: Joi.string().max(500).allow('', null),
      resourceType: Joi.string().valid('pdf', 'link').allow(null),
      resourceTitle: Joi.string().max(120).allow('', null),
      resourceUrl: Joi.string().uri({ allowRelative: true }).max(500).allow('', null),
      resourceDescription: Joi.string().max(500).allow('', null),
      isActive: Joi.boolean()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const stream = await Stream.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!stream) {
      return res.status(404).json({ message: 'Stream not found' });
    }

    res.json({
      success: true,
      stream
    });
  } catch (error) {
    console.error('Update stream error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteStream = async (req, res) => {
  try {
    const stream = await Stream.findById(req.params.id);
    if (!stream) {
      return res.status(404).json({ message: 'Stream not found' });
    }

    // Check if stream has subjects
    const subjectCount = await Subject.countDocuments({ stream: stream._id });
    if (subjectCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete stream. It has ${subjectCount} subjects.` 
      });
    }

    await stream.deleteOne();

    res.json({
      success: true,
      message: 'Stream deleted successfully'
    });
  } catch (error) {
    console.error('Delete stream error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Subject Management
exports.getSubjectsByStream = async (req, res) => {
  try {
    const { streamId } = req.params;
    
    const subjects = await Subject.find({ stream: streamId })
      .populate('stream', 'name')
      .sort({ name: 1 })
      .lean();

    // Get counts for each subject
    const subjectsWithCounts = await Promise.all(
      subjects.map(async (subject) => {
        const topicCount = await Topic.countDocuments({ subject: subject._id });
        const questionCount = await Question.countDocuments({
          topic: { $in: await Topic.find({ subject: subject._id }).distinct('_id') }
        });
        
        return {
          ...subject,
          topicCount,
          questionCount
        };
      })
    );

    res.json({
      success: true,
      subjects: subjectsWithCounts
    });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createSubject = async (req, res) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required().min(2).max(100),
      stream: Joi.string().required().hex().length(24),
      description: Joi.string().max(500).allow(''),
      isActive: Joi.boolean()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Verify stream exists
    const streamDoc = await Stream.findById(req.body.stream);
    if (!streamDoc) {
      return res.status(404).json({ message: 'Stream not found' });
    }

    const subject = new Subject(req.body);
    await subject.save();

    res.status(201).json({
      success: true,
      subject
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Subject name already exists in this stream' });
    }
    console.error('Create subject error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const schema = Joi.object({
      name: Joi.string().min(2).max(100),
      description: Joi.string().max(500).allow(''),
      isActive: Joi.boolean()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json({
      success: true,
      subject
    });
  } catch (error) {
    console.error('Update subject error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Check if subject has topics
    const topicCount = await Topic.countDocuments({ subject: subject._id });
    if (topicCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete subject. It has ${topicCount} topics.` 
      });
    }

    await subject.deleteOne();

    res.json({
      success: true,
      message: 'Subject deleted successfully'
    });
  } catch (error) {
    console.error('Delete subject error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Topic Management
exports.getTopicsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    
    const topics = await Topic.find({ subject: subjectId })
      .populate({
        path: 'subject',
        select: 'name',
        populate: {
          path: 'stream',
          select: 'name'
        }
      })
      .sort({ name: 1 })
      .lean();

    // Get question count for each topic
    const topicsWithCounts = await Promise.all(
      topics.map(async (topic) => {
        const questionCount = await Question.countDocuments({ topic: topic._id });
        return {
          ...topic,
          questionCount
        };
      })
    );

    res.json({
      success: true,
      topics: topicsWithCounts
    });
  } catch (error) {
    console.error('Get topics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTopic = async (req, res) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required().min(2).max(100),
      subject: Joi.string().required().hex().length(24),
      description: Joi.string().max(500).allow(''),
      isActive: Joi.boolean()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Verify subject exists
    const subjectDoc = await Subject.findById(req.body.subject);
    if (!subjectDoc) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const topic = new Topic(req.body);
    await topic.save();

    res.status(201).json({
      success: true,
      topic
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Topic name already exists in this subject' });
    }
    console.error('Create topic error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTopic = async (req, res) => {
  try {
    const schema = Joi.object({
      name: Joi.string().min(2).max(100),
      description: Joi.string().max(500).allow(''),
      isActive: Joi.boolean()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const topic = await Topic.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    res.json({
      success: true,
      topic
    });
  } catch (error) {
    console.error('Update topic error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    // Check if topic has questions
    const questionCount = await Question.countDocuments({ topic: topic._id });
    if (questionCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete topic. It has ${questionCount} questions.` 
      });
    }

    await topic.deleteOne();

    res.json({
      success: true,
      message: 'Topic deleted successfully'
    });
  } catch (error) {
    console.error('Delete topic error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Question Management
exports.getQuestionsByTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const questions = await Question.find({ topic: topicId })
      .populate({
        path: 'topic',
        select: 'name',
        populate: {
          path: 'subject',
          select: 'name',
          populate: {
            path: 'stream',
            select: 'name'
          }
        }
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Question.countDocuments({ topic: topicId });

    res.json({
      success: true,
      questions,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalQuestions: count
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createQuestion = async (req, res) => {
  try {
    console.log('Create question request body:', req.body);
    
    const schema = Joi.object({
      text: Joi.string().required().min(10).max(5000),
      options: Joi.array().items(Joi.string().max(500)).length(4).required(),
      correctOption: Joi.number().min(0).max(3).required(),
      topic: Joi.string().required().hex().length(24),
      stream: Joi.string().required().hex().length(24),
      subject: Joi.string().required().hex().length(24),
      explanation: Joi.string().allow('').max(5000),
      difficulty: Joi.string().valid('easy', 'medium', 'hard').default('medium')
    });

    const { error } = schema.validate(req.body);
    if (error) {
      console.log('Validation error:', error.details[0].message);
      return res.status(400).json({ message: error.details[0].message });
    }

    // Verify topic exists and get subject/stream info
    const topicDoc = await Topic.findById(req.body.topic).populate({
      path: 'subject',
      select: 'stream'
    });
    if (!topicDoc) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    // Add stream and subject from topic
    req.body.subject = topicDoc.subject._id;
    req.body.stream = topicDoc.subject.stream;

    // Transform the data to match the Question model schema
    const questionData = {
      questionText: req.body.text,
      options: req.body.options.map((optionText, index) => ({
        text: optionText,
        isCorrect: index === req.body.correctOption
      })),
      explanation: req.body.explanation,
      difficulty: req.body.difficulty.charAt(0).toUpperCase() + req.body.difficulty.slice(1), // Capitalize first letter
      stream: req.body.stream,
      subject: req.body.subject,
      topic: req.body.topic
    };

    console.log('Transformed question data:', questionData);

    const question = new Question(questionData);
    console.log('Question object before save:', question);
    
    await question.save();

    res.status(201).json({
      success: true,
      question
    });
  } catch (error) {
    console.error('Create question error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    console.log('Update question request body:', req.body);
    
    const schema = Joi.object({
      text: Joi.string().min(10).max(5000),
      options: Joi.array().items(Joi.string().max(500)).length(4),
      correctOption: Joi.number().min(0).max(3),
      explanation: Joi.string().allow('').max(5000),
      difficulty: Joi.string().valid('easy', 'medium', 'hard')
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Transform the data to match the Question model schema
    const updateData = {};
    
    if (req.body.text !== undefined) {
      updateData.questionText = req.body.text;
    }
    
    if (req.body.options !== undefined && req.body.correctOption !== undefined) {
      updateData.options = req.body.options.map((optionText, index) => ({
        text: optionText,
        isCorrect: index === req.body.correctOption
      }));
    }
    
    if (req.body.explanation !== undefined) {
      updateData.explanation = req.body.explanation;
    }
    
    if (req.body.difficulty !== undefined) {
      updateData.difficulty = req.body.difficulty.charAt(0).toUpperCase() + req.body.difficulty.slice(1);
    }

    console.log('Transformed update data:', updateData);

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json({
      success: true,
      question
    });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    await question.deleteOne();

    res.json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Duplicate Question
exports.duplicateQuestion = async (req, res) => {
  try {
    const originalQuestion = await Question.findById(req.params.id);
    if (!originalQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const newQuestion = new Question({
      text: originalQuestion.text + ' (Copy)',
      options: [...originalQuestion.options],
      correctOption: originalQuestion.correctOption,
      topic: originalQuestion.topic,
      stream: originalQuestion.stream,
      subject: originalQuestion.subject,
      explanation: originalQuestion.explanation,
      difficulty: originalQuestion.difficulty
    });

    await newQuestion.save();

    res.status(201).json({
      success: true,
      question: newQuestion
    });
  } catch (error) {
    console.error('Duplicate question error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Duplicate Topic with all questions
exports.duplicateTopic = async (req, res) => {
  try {
    const originalTopic = await Topic.findById(req.params.id);
    if (!originalTopic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    // Create new topic
    const newTopic = new Topic({
      name: originalTopic.name + ' (Copy)',
      subject: originalTopic.subject,
      description: originalTopic.description
    });
    await newTopic.save();

    // Duplicate all questions in the topic
    const questions = await Question.find({ topic: originalTopic._id });
    const duplicatedQuestions = await Promise.all(
      questions.map(async (q) => {
        const newQ = new Question({
          text: q.text,
          options: [...q.options],
          correctOption: q.correctOption,
          topic: newTopic._id,
          stream: q.stream,
          subject: q.subject,
          explanation: q.explanation,
          difficulty: q.difficulty
        });
        return newQ.save();
      })
    );

    res.status(201).json({
      success: true,
      topic: newTopic,
      questionCount: duplicatedQuestions.length
    });
  } catch (error) {
    console.error('Duplicate topic error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Move Topic to different subject
exports.moveTopic = async (req, res) => {
  try {
    const { newSubjectId } = req.body;
    
    const schema = Joi.object({
      newSubjectId: Joi.string().required().hex().length(24)
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Verify new subject exists
    const newSubject = await Subject.findById(newSubjectId).populate('stream');
    if (!newSubject) {
      return res.status(404).json({ message: 'Target subject not found' });
    }

    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    // Update topic's subject
    topic.subject = newSubjectId;
    await topic.save();

    // Update all questions in this topic with new stream and subject
    await Question.updateMany(
      { topic: topic._id },
      { 
        stream: newSubject.stream,
        subject: newSubjectId 
      }
    );

    res.json({
      success: true,
      topic
    });
  } catch (error) {
    console.error('Move topic error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Move Question to different topic
exports.moveQuestion = async (req, res) => {
  try {
    const { newTopicId } = req.body;
    
    const schema = Joi.object({
      newTopicId: Joi.string().required().hex().length(24)
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Verify new topic exists and get its subject/stream
    const newTopic = await Topic.findById(newTopicId).populate({
      path: 'subject',
      populate: { path: 'stream' }
    });
    if (!newTopic) {
      return res.status(404).json({ message: 'Target topic not found' });
    }

    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Update question with new hierarchy
    question.topic = newTopicId;
    question.subject = newTopic.subject._id;
    question.stream = newTopic.subject.stream;
    await question.save();

    res.json({
      success: true,
      question
    });
  } catch (error) {
    console.error('Move question error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Bulk delete questions
exports.bulkDeleteQuestions = async (req, res) => {
  try {
    const { questionIds } = req.body;
    
    const schema = Joi.object({
      questionIds: Joi.array().items(Joi.string().hex().length(24)).min(1).required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const result = await Question.deleteMany({ _id: { $in: questionIds } });

    res.json({
      success: true,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Bulk update questions
exports.bulkUpdateQuestions = async (req, res) => {
  try {
    const { questionIds, updates } = req.body;
    
    const schema = Joi.object({
      questionIds: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
      updates: Joi.object({
        difficulty: Joi.string().valid('easy', 'medium', 'hard'),
        topic: Joi.string().hex().length(24)
      }).min(1)
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // If changing topic, get new subject/stream info
    if (updates.topic) {
      const newTopic = await Topic.findById(updates.topic).populate({
        path: 'subject',
        populate: { path: 'stream' }
      });
      if (!newTopic) {
        return res.status(404).json({ message: 'Target topic not found' });
      }
      updates.subject = newTopic.subject._id;
      updates.stream = newTopic.subject.stream;
    }

    const result = await Question.updateMany(
      { _id: { $in: questionIds } },
      { $set: updates }
    );

    res.json({
      success: true,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export questions
exports.exportQuestions = async (req, res) => {
  try {
    const { topicId, format = 'json' } = req.query;
    
    const query = topicId ? { topic: topicId } : {};
    const questions = await Question.find(query)
      .populate({
        path: 'topic',
        select: 'name',
        populate: {
          path: 'subject',
          select: 'name',
          populate: {
            path: 'stream',
            select: 'name'
          }
        }
      })
      .lean();

    if (format === 'json') {
      res.json({
        success: true,
        count: questions.length,
        questions
      });
    } else if (format === 'csv') {
      // Convert to CSV format
      const csv = [
        'Stream,Subject,Topic,Question,Option1,Option2,Option3,Option4,CorrectOption,Difficulty,Explanation',
        ...questions.map(q => [
          q.topic.subject.stream.name,
          q.topic.subject.name,
          q.topic.name,
          `"${q.text}"`,
          `"${q.options[0]}"`,
          `"${q.options[1]}"`,
          `"${q.options[2]}"`,
          `"${q.options[3]}"`,
          q.correctOption + 1,
          q.difficulty,
          `"${q.explanation || ''}"`
        ].join(','))
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=questions.csv');
      res.send(csv);
    }
  } catch (error) {
    console.error('Export questions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Import questions
exports.importQuestions = async (req, res) => {
  try {
    const { questions } = req.body;
    
    const schema = Joi.object({
      questions: Joi.array().items(Joi.object({
        text: Joi.string().required().min(10).max(5000),
        options: Joi.array().items(Joi.string().max(500)).length(4).required(),
        correctOption: Joi.number().min(0).max(3).required(),
        topic: Joi.string().hex().length(24).required(),
        explanation: Joi.string().allow('').max(5000),
        difficulty: Joi.string().valid('easy', 'medium', 'hard')
      })).min(1).required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Process each question and add stream/subject info
    const processedQuestions = await Promise.all(
      questions.map(async (q) => {
        const topic = await Topic.findById(q.topic).populate({
          path: 'subject',
          select: 'stream'
        });
        if (!topic) {
          throw new Error(`Topic not found: ${q.topic}`);
        }
        
        return {
          ...q,
          subject: topic.subject._id,
          stream: topic.subject.stream
        };
      })
    );

    const createdQuestions = await Question.insertMany(processedQuestions);

    res.json({
      success: true,
      count: createdQuestions.length,
      questions: createdQuestions
    });
  } catch (error) {
    console.error('Import questions error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};
