// src/pages/TestSection.jsx - Consistent Dark Theme
import React, { useState, useEffect, useCallback } from 'react';
import { 
  BookOpen, Clock, Target, TrendingUp, Star, ArrowRight, Users, Award,
  Play, Pause, SkipForward, SkipBack, Flag, CheckCircle, XCircle,
  RotateCcw, Home, FileText, BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock Question Data (same as before)
const mockQuestions = [
  {
    id: 1,
    question: "What is the time complexity of binary search algorithm?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correctAnswer: 1,
    explanation: "Binary search repeatedly divides the search space in half, resulting in O(log n) time complexity.",
    difficulty: "Medium",
    subject: "Computer Science"
  },
  {
    id: 2,
    question: "Which of the following is NOT a fundamental data structure?",
    options: ["Array", "Graph", "Database", "Stack"],
    correctAnswer: 2,
    explanation: "Database is a storage system, not a fundamental data structure like arrays, graphs, or stacks.",
    difficulty: "Easy",
    subject: "Computer Science"
  },
  {
    id: 3,
    question: "What is the derivative of x³?",
    options: ["3x²", "x²", "3x", "x³/3"],
    correctAnswer: 0,
    explanation: "Using the power rule: d/dx(x³) = 3x²",
    difficulty: "Easy",
    subject: "Mathematics"
  },
  {
    id: 4,
    question: "Which programming paradigm does Python primarily support?",
    options: ["Only Object-Oriented", "Only Functional", "Multi-paradigm", "Only Procedural"],
    correctAnswer: 2,
    explanation: "Python supports multiple programming paradigms including object-oriented, functional, and procedural programming.",
    difficulty: "Medium",
    subject: "Computer Science"
  },
  {
    id: 5,
    question: "What is the chemical formula for water?",
    options: ["H₂O", "CO₂", "NaCl", "CH₄"],
    correctAnswer: 0,
    explanation: "Water consists of two hydrogen atoms and one oxygen atom, hence H₂O.",
    difficulty: "Easy",
    subject: "Chemistry"
  }
];

// Test Card Component - Dark Theme
const TestCard = ({ title, description, duration, questions, difficulty, category, popularity, onStartTest }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const difficultyColors = {
    Easy: 'bg-green-900/30 text-green-400 border-green-500/30',
    Medium: 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30',
    Hard: 'bg-red-900/30 text-red-400 border-red-500/30'
  };

  return (
    <div 
      className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 transition-all duration-300 hover:shadow-2xl hover:border-blue-500/50 hover:-translate-y-2 cursor-pointer group ${
        isHovered ? 'shadow-2xl border-blue-500/50 -translate-y-2' : 'shadow-lg'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-200 mb-2 group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {description}
          </p>
        </div>
        <div className="ml-4 flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < popularity ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
            />
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <BookOpen className="w-4 h-4" />
            <span>{questions} Qs</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>2.5k taken</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${difficultyColors[difficulty]}`}>
          {difficulty}
        </span>
      </div>

      {/* Category Badge */}
      <div className="mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-500/30">
          <Target className="w-3 h-3 mr-1" />
          {category}
        </span>
      </div>

      {/* Action Button */}
      <button 
        onClick={onStartTest}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg group flex items-center justify-center space-x-2"
      >
        <Play className="w-4 h-4" />
        <span>Start Test</span>
        <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
      </button>
    </div>
  );
};

// Test Interface Component - Dark Theme
const TestInterface = ({ onEndTest, testData }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(testData.duration * 60);
  const [isPlaying, setIsPlaying] = useState(true);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  // Timer Effect (same as before)
  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onEndTest(answers, flaggedQuestions);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, onEndTest, answers, flaggedQuestions]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const toggleFlag = (questionId) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const goToQuestion = (index) => {
    setCurrentQuestion(index);
  };

  const nextQuestion = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const getQuestionStatus = (index) => {
    const questionId = mockQuestions[index].id;
    if (answers[questionId] !== undefined) return 'answered';
    if (flaggedQuestions.has(questionId)) return 'flagged';
    if (index === currentQuestion) return 'current';
    return 'unanswered';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'answered': return 'bg-green-600 text-white';
      case 'flagged': return 'bg-yellow-600 text-white';
      case 'current': return 'bg-blue-600 text-white';
      default: return 'bg-gray-600 text-gray-300 hover:bg-gray-500';
    }
  };

  const currentQuestionData = mockQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / mockQuestions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm shadow-sm border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-200">{testData.title}</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span className={`font-mono ${timeLeft < 300 ? 'text-red-400 font-bold' : 'text-gray-300'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-lg transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pause' : 'Resume'}</span>
              </button>
              
              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Question Navigation Sidebar */}
        <div className="w-64 bg-gray-800/50 backdrop-blur-sm border-r border-gray-700/50 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Questions</h3>
            <div className="text-sm text-gray-400">
              Answered: {answeredCount}/{mockQuestions.length}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / mockQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {mockQuestions.map((_, index) => {
              const status = getQuestionStatus(index);
              return (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`w-10 h-10 rounded-lg font-medium text-sm transition-all duration-200 ${getStatusColor(status)}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          <div className="mt-6 space-y-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span className="text-gray-400">Answered</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-600 rounded"></div>
              <span className="text-gray-400">Flagged</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span className="text-gray-400">Current</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-600 rounded"></div>
              <span className="text-gray-400">Not Answered</span>
            </div>
          </div>
        </div>

        {/* Main Question Area */}
        <div className="flex-1 p-8 bg-gray-900">
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">
                  Question {currentQuestion + 1} of {mockQuestions.length}
                </span>
                <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="px-3 py-1 bg-blue-900/30 text-blue-400 border border-blue-500/30 rounded-full text-sm font-medium">
                      {currentQuestionData.subject}
                    </span>
                    <span className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm">
                      {currentQuestionData.difficulty}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-200 leading-relaxed">
                    {currentQuestionData.question}
                  </h2>
                </div>
                
                <button
                  onClick={() => toggleFlag(currentQuestionData.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    flaggedQuestions.has(currentQuestionData.id)
                      ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30'
                      : 'bg-gray-700/50 text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <Flag className="w-5 h-5" />
                </button>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestionData.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      answers[currentQuestionData.id] === index
                        ? 'border-blue-500 bg-blue-900/20'
                        : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestionData.id}`}
                      value={index}
                      checked={answers[currentQuestionData.id] === index}
                      onChange={() => handleAnswerSelect(currentQuestionData.id, index)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      answers[currentQuestionData.id] === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-500'
                    }`}>
                      {answers[currentQuestionData.id] === index && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-gray-300">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SkipBack className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleAnswerSelect(currentQuestionData.id, undefined)}
                  className="px-4 py-2 text-gray-400 hover:text-gray-200 font-medium transition-colors"
                >
                  Clear Answer
                </button>
              </div>

              <button
                onClick={nextQuestion}
                disabled={currentQuestion === mockQuestions.length - 1}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-700">
            <h3 className="text-xl font-bold text-gray-200 mb-4">Submit Test?</h3>
            <p className="text-gray-400 mb-6">
              You have answered {answeredCount} out of {mockQuestions.length} questions. 
              Are you sure you want to submit your test?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium transition-colors"
              >
                Continue Test
              </button>
              <button
                onClick={() => onEndTest(answers, flaggedQuestions)}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Results Component - Dark Theme
const TestResults = ({ answers, onRetakeTest, onBackToTests, testData }) => {
  const navigate = useNavigate();
  
  const calculateResults = () => {
    let correct = 0;
    let incorrect = 0;
    let skipped = 0;

    mockQuestions.forEach(question => {
      const userAnswer = answers[question.id];
      if (userAnswer === undefined) {
        skipped++;
      } else if (userAnswer === question.correctAnswer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const percentage = Math.round((correct / mockQuestions.length) * 100);
    const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : 'F';

    return { correct, incorrect, skipped, percentage, grade };
  };

  const results = calculateResults();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-6">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-200 mb-4">Test Completed!</h1>
          <p className="text-xl text-gray-400">Here are your results for {testData.title}</p>
        </div>

        {/* Results Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-200">{results.correct}</p>
                <p className="text-gray-400 text-sm">Correct</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-200">{results.incorrect}</p>
                <p className="text-gray-400 text-sm">Incorrect</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-700/50 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-200">{results.skipped}</p>
                <p className="text-gray-400 text-sm">Skipped</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-200">{results.percentage}%</p>
                <p className="text-gray-400 text-sm">Score</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 mb-8">
          <h2 className="text-2xl font-bold text-gray-200 mb-6">Performance Summary</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-4">Overall Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Grade</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    results.grade === 'A+' || results.grade === 'A' ? 'bg-green-900/30 text-green-400 border border-green-500/30' :
                    results.grade === 'B' ? 'bg-blue-900/30 text-blue-400 border border-blue-500/30' :
                    results.grade === 'C' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30' :
                    'bg-red-900/30 text-red-400 border border-red-500/30'
                  }`}>
                    {results.grade}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Accuracy</span>
                  <span className="font-semibold text-gray-200">{results.percentage}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Questions Attempted</span>
                  <span className="font-semibold text-gray-200">{mockQuestions.length - results.skipped}/{mockQuestions.length}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-4">Score Breakdown</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-green-400">Correct Answers</span>
                  <span className="font-semibold text-gray-200">{results.correct} × 4 = {results.correct * 4} marks</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-red-400">Wrong Answers</span>
                  <span className="font-semibold text-gray-200">{results.incorrect} × (-1) = -{results.incorrect} marks</span>
                </div>
                <div className="border-t border-gray-600 pt-2">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-gray-200">Total Score</span>
                    <span className="text-gray-200">{(results.correct * 4) - results.incorrect} / {mockQuestions.length * 4}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Review */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 mb-8">
          <h2 className="text-2xl font-bold text-gray-200 mb-6">Question Review</h2>
          <div className="space-y-6">
            {mockQuestions.map((question, index) => {
              const userAnswer = answers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;
              const isSkipped = userAnswer === undefined;

              return (
                <div key={question.id} className={`p-6 rounded-xl border-2 ${
                  isSkipped ? 'border-gray-600 bg-gray-700/30' :
                  isCorrect ? 'border-green-500/30 bg-green-900/20' : 'border-red-500/30 bg-red-900/20'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-200">
                      Q{index + 1}. {question.question}
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isSkipped ? 'bg-gray-700 text-gray-300' :
                      isCorrect ? 'bg-green-900/30 text-green-400 border border-green-500/30' : 'bg-red-900/30 text-red-400 border border-red-500/30'
                    }`}>
                      {isSkipped ? 'Skipped' : isCorrect ? 'Correct' : 'Incorrect'}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Your Answer:</p>
                      <p className={`font-medium ${
                        isSkipped ? 'text-gray-500' :
                        isCorrect ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {isSkipped ? 'Not answered' : question.options[userAnswer]}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Correct Answer:</p>
                      <p className="font-medium text-green-400">
                        {question.options[question.correctAnswer]}
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Explanation:</p>
                    <p className="text-blue-300">{question.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRetakeTest}
            className="flex items-center justify-center space-x-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Retake Test</span>
          </button>
          
          <button
            onClick={onBackToTests}
            className="flex items-center justify-center space-x-2 px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            <span>More Tests</span>
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center space-x-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Main TestSection Component with unified dark theme
const TestSection = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedTest, setSelectedTest] = useState(null);
  const [testAnswers, setTestAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [streams, setStreams] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for tests
  const mockStreams = [
    {
      _id: '1',
      title: 'JEE Main Mock Test',
      description: 'Comprehensive test covering Physics, Chemistry, and Mathematics',
      duration: 180,
      questions: 75,
      difficulty: 'Hard',
      category: 'Engineering',
      popularity: 5
    },
    {
      _id: '2',
      title: 'NEET Biology Practice',
      description: 'Focus on Botany and Zoology concepts for medical entrance',
      duration: 180,
      questions: 180,
      difficulty: 'Medium',
      category: 'Medical',
      popularity: 4
    },
    {
      _id: '3',
      title: 'CAT Quantitative Aptitude',
      description: 'Mathematical reasoning and problem-solving skills',
      duration: 90,
      questions: 34,
      difficulty: 'Hard',
      category: 'Management',
      popularity: 4
    },
    {
      _id: '4',
      title: 'GATE Computer Science',
      description: 'Data structures, algorithms, and computer systems',
      duration: 180,
      questions: 65,
      difficulty: 'Hard',
      category: 'Engineering',
      popularity: 5
    },
    {
      _id: '5',
      title: 'UPSC Prelims GS',
      description: 'General Studies for civil services preliminary exam',
      duration: 120,
      questions: 100,
      difficulty: 'Medium',
      category: 'Civil Services',
      popularity: 5
    }
  ];

  const categories = ['All', 'Engineering', 'Medical', 'Management', 'Civil Services', 'Banking'];

  useEffect(() => {
    const loadTests = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStreams(mockStreams);
        setError(null);
      } catch (err) {
        setError('Failed to load tests. Please try again.',err);
      } finally {
        setLoading(false);
      }
    };

    loadTests();
  }, []);

  const filteredStreams = streams.filter(stream => {
    const matchesCategory = selectedCategory === 'All' || stream.category === selectedCategory;
    const matchesSearch = stream.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         stream.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleStartTest = (test) => {
    setSelectedTest(test);
    setCurrentView('test');
    setTestAnswers({});
    setFlaggedQuestions(new Set());
  };

  const handleEndTest = (answers, flagged) => {
    setTestAnswers(answers);
    setFlaggedQuestions(flagged);
    setCurrentView('results');
  };

  const handleRetakeTest = () => {
    setCurrentView('test');
    setTestAnswers({});
    setFlaggedQuestions(new Set());
  };

  const handleBackToTests = () => {
    setCurrentView('list');
    setSelectedTest(null);
    setTestAnswers({});
    setFlaggedQuestions(new Set());
  };

  // Loading Skeleton - Dark Theme
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 animate-pulse">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="h-6 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            </div>
            <div className="ml-4 flex space-x-1">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="w-4 h-4 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-4 bg-gray-700 rounded w-16"></div>
            <div className="h-4 bg-gray-700 rounded w-16"></div>
            <div className="h-4 bg-gray-700 rounded w-16"></div>
          </div>
          <div className="h-6 bg-gray-700 rounded w-24 mb-4"></div>
          <div className="h-12 bg-gray-700 rounded-xl"></div>
        </div>
      ))}
    </div>
  );

  // Render different views
  if (currentView === 'test' && selectedTest) {
    return <TestInterface onEndTest={handleEndTest} testData={selectedTest} />;
  }

  if (currentView === 'results' && selectedTest) {
    return (
      <TestResults 
        answers={testAnswers}
        onRetakeTest={handleRetakeTest}
        onBackToTests={handleBackToTests}
        testData={selectedTest}
      />
    );
  }

  // Test List View - Dark Theme
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-200 mb-6">
            Mock Tests for
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> All Major Exams</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Practice with our comprehensive collection of mock tests designed to simulate real exam conditions
            and boost your confidence
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700/50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-200 placeholder-gray-500"
              />
              <BookOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-200">{streams.length}</p>
                <p className="text-gray-400 text-sm">Tests Available</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-200">95%</p>
                <p className="text-gray-400 text-sm">Accuracy</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-900/30 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-200">85%</p>
                <p className="text-gray-400 text-sm">Success Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading && <LoadingSkeleton />}
        
        {error && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-900/30 rounded-full mb-4">
              <Target className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-red-400 text-lg font-medium mb-4">Error loading tests</p>
            <p className="text-gray-400 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-gray-400">
                Showing <span className="font-semibold text-gray-200">{filteredStreams.length}</span> tests
                {selectedCategory !== 'All' && (
                  <span> in <span className="font-semibold text-blue-400">{selectedCategory}</span></span>
                )}
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Updated 2 hours ago</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredStreams.map((stream) => (
                <TestCard
                  key={stream._id}
                  title={stream.title}
                  description={stream.description}
                  duration={`${stream.duration} mins`}
                  questions={stream.questions}
                  difficulty={stream.difficulty}
                  category={stream.category}
                  popularity={stream.popularity}
                  onStartTest={() => handleStartTest(stream)}
                />
              ))}
            </div>

            {filteredStreams.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800/50 rounded-full mb-4">
                  <BookOpen className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-gray-400 text-lg">No tests found matching your criteria</p>
                <button 
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchTerm('');
                  }}
                  className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default TestSection;