import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, ChevronLeft, ChevronRight, Flag, AlertTriangle, 
  CheckCircle, Circle, Home, RotateCcw, Send, Loader,
  ArrowLeft, ArrowRight, Timer, BookOpen, Target
} from 'lucide-react';
import API_BASE_URL from '../config/api';

const TestInterface = ({ testConfig, onTestComplete, onBackToSelection }) => {
  // Test state
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [testStartTime, setTestStartTime] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const timerRef = useRef(null);

  // Fetch questions when component mounts
  useEffect(() => {
    fetchTestQuestions();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Start timer when questions are loaded
  useEffect(() => {
    if (questions.length > 0 && !testStartTime) {
      const startTime = new Date();
      setTestStartTime(startTime);
      const totalTime = Math.ceil(questions.length * 1.5) * 60; // 1.5 minutes per question
      setTimeLeft(totalTime);
      startTimer(totalTime);
    }
  }, [questions]);

  const fetchTestQuestions = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🔄 Generating test with config:', testConfig);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/tests/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(testConfig)
      });

      console.log('📡 Generate test response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📊 Generated test data:', data);

      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        console.log(`✅ Loaded ${data.questions.length} questions`);
      } else {
        throw new Error('No questions received from server');
      }

    } catch (error) {
      console.error('❌ Error generating test:', error);
      setError(error.message || 'Failed to load test questions');
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestionIndex]._id]: optionIndex
    }));
    console.log(`Selected option ${optionIndex} for question ${questions[currentQuestionIndex]._id}`);
  };

  const handleQuestionNavigation = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const toggleFlag = () => {
    const questionId = questions[currentQuestionIndex]._id;
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

  const getQuestionStatus = (index) => {
    const questionId = questions[index]._id;
    if (answers[questionId] !== undefined) return 'answered';
    if (flaggedQuestions.has(questionId)) return 'flagged';
    if (index === currentQuestionIndex) return 'current';
    return 'unanswered';
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const handleSubmitTest = () => {
    setShowSubmitModal(true);
  };

  const handleAutoSubmit = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    submitTestAnswers();
  };

  const submitTestAnswers = async () => {
    try {
      setSubmitting(true);
      
      const endTime = new Date();
      const testAnswers = questions.map(question => ({
        questionId: question._id,
        selectedOption: answers[question._id] ?? -1,
        timeTaken: 0 // We can implement individual question timing later
      }));

      const submitData = {
        streamId: testConfig.streamId,
        subjectIds: testConfig.subjectIds,
        topicIds: testConfig.topicIds,
        answers: testAnswers,
        startTime: testStartTime.toISOString(),
        endTime: endTime.toISOString(),
        difficulty: testConfig.difficulty
      };

      console.log('📤 Submitting test:', submitData);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/tests/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit test');
      }

      const result = await response.json();
      console.log('✅ Test submitted successfully:', result);
      
      onTestComplete(result);

    } catch (error) {
      console.error('❌ Error submitting test:', error);
      setError(error.message || 'Failed to submit test');
    } finally {
      setSubmitting(false);
      setShowSubmitModal(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-blue-400 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Generating Your Test</h2>
          <p className="text-gray-400">Please wait while we prepare your questions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-red-600 border border-red-500 rounded-xl p-8 max-w-md mx-auto">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-white" />
            <h3 className="text-white font-bold text-xl">Error</h3>
          </div>
          <p className="text-white mb-6">{error}</p>
          <div className="flex space-x-3">
            <button
              onClick={fetchTestQuestions}
              className="px-4 py-2 bg-white text-red-600 rounded-lg font-bold hover:bg-gray-100 flex-1"
            >
              Retry
            </button>
            <button
              onClick={onBackToSelection}
              className="px-4 py-2 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 flex-1"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Test Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Question info */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onBackToSelection}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
              >
                <Home className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-white">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </h1>
                <p className="text-gray-400 text-sm">
                  {getAnsweredCount()} answered • {flaggedQuestions.size} flagged
                </p>
              </div>
            </div>

            {/* Center - Timer */}
            <div className="flex items-center space-x-2">
              <Timer className={`w-5 h-5 ${timeLeft < 300 ? 'text-red-400' : 'text-blue-400'}`} />
              <span className={`font-bold text-lg ${timeLeft < 300 ? 'text-red-400' : 'text-white'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>

            {/* Right side - Submit button */}
            <button
              onClick={handleSubmitTest}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors"
            >
              Submit Test
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Palette - Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Question Palette</h3>
              
              {/* Status Legend */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-gray-700">Answered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-gray-700">Flagged</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-gray-700">Current</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <span className="text-gray-700">Not Visited</span>
                </div>
              </div>

              {/* Question Grid */}
              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, index) => {
                  const status = getQuestionStatus(index);
                  let bgColor = 'bg-gray-300';
                  
                  if (status === 'answered') bgColor = 'bg-green-500';
                  else if (status === 'flagged') bgColor = 'bg-red-500';
                  else if (status === 'current') bgColor = 'bg-blue-500';

                  return (
                    <button
                      key={index}
                      onClick={() => handleQuestionNavigation(index)}
                      className={`w-8 h-8 ${bgColor} text-white font-bold text-sm rounded hover:opacity-80 transition-opacity`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl p-8">
              {currentQuestion && (
                <>
                  {/* Question Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{currentQuestionIndex + 1}</span>
                      </div>
                      <span className="text-gray-600 font-medium">
                        Difficulty: <span className="font-bold text-gray-900">{currentQuestion.difficulty}</span>
                      </span>
                    </div>
                    <button
                      onClick={toggleFlag}
                      className={`p-2 rounded-lg transition-colors ${
                        flaggedQuestions.has(currentQuestion._id)
                          ? 'bg-red-100 text-red-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Flag className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Question Text */}
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 leading-relaxed whitespace-pre-wrap">
                      {currentQuestion.questionText}
                    </h2>
                  </div>

                  {/* Answer Options */}
                  <div className="space-y-4 mb-8">
                    {currentQuestion.options.map((option, index) => {
                      const isSelected = answers[currentQuestion._id] === index;
                      return (
                        <div
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-400'
                            }`}>
                              {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                            <span className="text-lg font-medium text-gray-900">
                              {String.fromCharCode(65 + index)}. {option.text}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center">
                    <button
                      onClick={handlePrevious}
                      disabled={currentQuestionIndex === 0}
                      className="flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span>Previous</span>
                    </button>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleAnswerSelect(-1)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                      >
                        Clear Answer
                      </button>
                      <button
                        onClick={toggleFlag}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          flaggedQuestions.has(currentQuestion._id)
                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        }`}
                      >
                        {flaggedQuestions.has(currentQuestion._id) ? 'Unflag' : 'Flag'} Question
                      </button>
                    </div>

                    <button
                      onClick={handleNext}
                      disabled={currentQuestionIndex === questions.length - 1}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Submit Test?</h3>
              <p className="text-gray-600 mb-6">
                You have answered {getAnsweredCount()} out of {questions.length} questions. 
                Are you sure you want to submit your test?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitTestAnswers}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Test</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestInterface;
