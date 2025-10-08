const { Question } = require('../models/Question');
const { TestResult, validateTestResult } = require('../models/TestResult');
const { Stream } = require('../models/stream');
const { Subject } = require('../models/Subject');
const { Topic } = require('../models/Topic');

// Generate test based on user preferences
const generateTest = async (req, res) => {
  try {
    console.log('Test generation request received:', req.body);
    
    const {
      streamId,
      subjectIds = [], // Array of subject IDs, empty means all subjects
      topicIds = [],   // Array of topic IDs, empty means all topics
      numQuestions = 20,
      difficulty = 'Mixed' // 'Easy', 'Medium', 'Hard', 'Mixed'
    } = req.body;

    // Validation
    if (!streamId) {
      return res.status(400).json({ error: 'Stream ID is required' });
    }

    if (numQuestions < 1 || numQuestions > 200) {
      return res.status(400).json({ error: 'Number of questions must be between 1 and 200' });
    }

    // Build query for questions
    let query = {
      stream: streamId,
      isActive: true
    };

    // Add subject filter if specified
    if (subjectIds.length > 0) {
      query.subject = { $in: subjectIds };
    }

    // Add topic filter if specified
    if (topicIds.length > 0) {
      query.topic = { $in: topicIds };
    }

    // Add difficulty filter if not mixed
    if (difficulty !== 'Mixed') {
      query.difficulty = difficulty;
    }

    console.log('Question query:', query);
    console.log('Requested questions:', numQuestions, 'Difficulty:', difficulty);

    let questions;

    if (difficulty === 'Mixed') {
      // For mixed difficulty, get equal distribution
      const easyQuestions = await Question.find({ ...query, difficulty: 'Easy' });
      const mediumQuestions = await Question.find({ ...query, difficulty: 'Medium' });
      const hardQuestions = await Question.find({ ...query, difficulty: 'Hard' });

      const questionsPerDifficulty = Math.floor(numQuestions / 3);
      const remainder = numQuestions % 3;

      const selectedQuestions = [
        ...shuffleArray(easyQuestions).slice(0, questionsPerDifficulty + (remainder > 0 ? 1 : 0)),
        ...shuffleArray(mediumQuestions).slice(0, questionsPerDifficulty + (remainder > 1 ? 1 : 0)),
        ...shuffleArray(hardQuestions).slice(0, questionsPerDifficulty)
      ];

      questions = shuffleArray(selectedQuestions);
    } else {
      // For specific difficulty
      const allQuestions = await Question.find(query);
      questions = shuffleArray(allQuestions).slice(0, numQuestions);
    }

    console.log('Questions found:', questions.length);
    
    if (questions.length === 0) {
      console.log('No questions found for query:', query);
      return res.status(404).json({ 
        error: 'No questions found matching the criteria',
        suggestions: 'Try selecting different subjects, topics, or difficulty levels'
      });
    }

    if (questions.length < numQuestions) {
      console.warn(`Only ${questions.length} questions available, requested ${numQuestions}`);
    }

    // Remove correct answers and explanations for security
    const sanitizedQuestions = questions.map(q => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options.map(opt => ({ text: opt.text })), // Remove isCorrect flag
      difficulty: q.difficulty,
      stream: q.stream,
      subject: q.subject,
      topic: q.topic
    }));

    // Get metadata for display
    const stream = await Stream.findById(streamId, 'name');
    const subjects = subjectIds.length > 0 ? 
      await Subject.find({ _id: { $in: subjectIds } }, 'name') : 
      await Subject.find({ stream: streamId }, 'name');
    const topics = topicIds.length > 0 ? 
      await Topic.find({ _id: { $in: topicIds } }, 'name') :
      await Topic.find({ 
        subject: { $in: subjects.map(s => s._id) }
      }, 'name');

    res.status(200).json({
      questions: sanitizedQuestions,
      metadata: {
        stream: stream.name,
        subjects: subjects.map(s => s.name),
        topics: topics.map(t => t.name),
        totalQuestions: sanitizedQuestions.length,
        difficulty,
        timeLimit: Math.ceil(sanitizedQuestions.length * 1.5) // 1.5 minutes per question
      }
    });

  } catch (error) {
    console.error('Error generating test:', error);
    res.status(500).json({ error: 'Failed to generate test' });
  }
};

// Submit test and calculate results
const submitTest = async (req, res) => {
  try {
    console.log('Test submission request received:', req.body);
    console.log('User from token:', req.user);
    
    const {
      streamId,
      subjectIds = [],
      topicIds = [],
      answers, // Array of { questionId, selectedOption }
      startTime,
      endTime,
      difficulty
    } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Answers array is required' });
    }

    // Get all questions to verify answers
    const questionIds = answers.map(a => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    if (questions.length !== questionIds.length) {
      return res.status(400).json({ error: 'Some questions not found' });
    }

    // Calculate results
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let skippedQuestions = 0;

    const detailedAnswers = answers.map(answer => {
      const question = questions.find(q => q._id.toString() === answer.questionId);
      
      if (answer.selectedOption === -1 || answer.selectedOption === undefined) {
        skippedQuestions++;
        return {
          question: answer.questionId,
          selectedOption: -1,
          isCorrect: false,
          timeTaken: answer.timeTaken || 0
        };
      }

      const correctOptionIndex = question.options.findIndex(opt => opt.isCorrect);
      const isCorrect = answer.selectedOption === correctOptionIndex;
      
      if (isCorrect) {
        correctAnswers++;
      } else {
        wrongAnswers++;
      }

      return {
        question: answer.questionId,
        selectedOption: answer.selectedOption,
        isCorrect,
        timeTaken: answer.timeTaken || 0
      };
    });

    const totalQuestions = answers.length;
    const answeredQuestions = totalQuestions - skippedQuestions;
    const score = correctAnswers * 4 - wrongAnswers * 1; // JEE-style scoring
    const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    const timeTaken = Math.round((new Date(endTime) - new Date(startTime)) / (1000 * 60)); // minutes

    // Save test result
    const testResult = new TestResult({
      user: req.user.id || req.user._id,
      stream: streamId,
      subjects: subjectIds,
      topics: topicIds,
      totalQuestions,
      answeredQuestions,
      correctAnswers,
      wrongAnswers,
      skippedQuestions,
      score,
      percentage: Math.round(percentage * 100) / 100,
      timeTaken,
      difficulty,
      answers: detailedAnswers,
      startTime: new Date(startTime),
      endTime: new Date(endTime)
    });

    await testResult.save();

    // Prepare detailed result with correct answers for review
    const questionsWithResults = questions.map(question => {
      const userAnswer = answers.find(a => a.questionId === question._id.toString());
      const correctOptionIndex = question.options.findIndex(opt => opt.isCorrect);
      
      return {
        _id: question._id,
        questionText: question.questionText,
        options: question.options.map(opt => ({ text: opt.text })),
        correctAnswer: correctOptionIndex,
        selectedAnswer: userAnswer ? userAnswer.selectedOption : -1,
        isCorrect: userAnswer ? userAnswer.selectedOption === correctOptionIndex : false,
        explanation: question.explanation,
        difficulty: question.difficulty
      };
    });

    res.status(200).json({
      testResultId: testResult._id,
      summary: {
        totalQuestions,
        answeredQuestions,
        correctAnswers,
        wrongAnswers,
        skippedQuestions,
        score,
        percentage: Math.round(percentage * 100) / 100,
        timeTaken,
        difficulty
      },
      questions: questionsWithResults
    });

  } catch (error) {
    console.error('Error submitting test:', error);
    res.status(500).json({ error: 'Failed to submit test' });
  }
};

// Get user's test history
const getTestHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const testResults = await TestResult.find({ user: req.user._id })
      .populate('stream', 'name')
      .populate('subjects', 'name')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .select('-answers'); // Exclude detailed answers for list view

    const total = await TestResult.countDocuments({ user: req.user._id });

    res.status(200).json({
      testResults,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching test history:', error);
    res.status(500).json({ error: 'Failed to fetch test history' });
  }
};

// Get detailed test result by ID
const getTestResult = async (req, res) => {
  try {
    const testResult = await TestResult.findOne({
      _id: req.params.id,
      user: req.user._id
    })
    .populate('stream', 'name')
    .populate('subjects', 'name')
    .populate('topics', 'name')
    .populate({
      path: 'answers.question',
      select: 'questionText options explanation difficulty'
    });

    if (!testResult) {
      return res.status(404).json({ error: 'Test result not found' });
    }

    res.status(200).json(testResult);

  } catch (error) {
    console.error('Error fetching test result:', error);
    res.status(500).json({ error: 'Failed to fetch test result' });
  }
};

// Helper function to shuffle array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

module.exports = {
  generateTest,
  submitTest,
  getTestHistory,
  getTestResult
};