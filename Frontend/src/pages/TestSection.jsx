import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  BookOpen, Clock, Target, TrendingUp, Star, ArrowRight, Users, Award,
  Play, ChevronLeft, ChevronRight, Flag, CheckCircle, XCircle, RotateCcw,
  Home, FileText, BarChart3, Settings, Filter, Zap, Brain, Award as Trophy,
  Loader, AlertCircle, Timer, ArrowLeft, Send, Shield, Eye, EyeOff,
  Sparkles, Rocket, Medal, Crown, Flame, Coffee, Lightbulb, Calendar,
  User, MapPin, Activity, PieChart, TrendingDown, MoreHorizontal, Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';

// Enhanced Anti-Cheating Test Interface Component
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

  // Anti-cheating states
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [cheatingAttempts, setCheatingAttempts] = useState([]);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [questionTimeSpent, setQuestionTimeSpent] = useState({});
  const [canMoveToNext, setCanMoveToNext] = useState(true);

  const timerRef = useRef(null);
  const questionTimerRef = useRef(null);

  // Anti-cheating functions (keeping existing logic)
  const enterFullscreen = useCallback(() => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }, []);

  const logCheatingAttempt = useCallback((type, details = '') => {
    const attempt = {
      type,
      details,
      timestamp: new Date().toISOString(),
      questionIndex: currentQuestionIndex
    };
    setCheatingAttempts(prev => [...prev, attempt]);
    console.warn('🚨 Cheating attempt detected:', attempt);
  }, [currentQuestionIndex]);

  // Initialize test and set up security
  useEffect(() => {
    fetchTestQuestions();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (questionTimerRef.current) clearInterval(questionTimerRef.current);
      exitFullscreen();
    };
  }, [exitFullscreen]);

  // Start timer and fullscreen when questions are loaded
  useEffect(() => {
    if (questions.length > 0 && !testStartTime) {
      const startTime = new Date();
      setTestStartTime(startTime);
      const totalTime = Math.ceil(questions.length * 1.5) * 60;
      setTimeLeft(totalTime);
      startTimer(totalTime);
      setTimeout(() => enterFullscreen(), 1000);
    }
  }, [questions, testStartTime, enterFullscreen]);

  const fetchTestQuestions = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      console.log('Token for test generation:', token ? 'Token exists' : 'No token found');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      const response = await fetch(`${API_BASE_URL}/api/tests/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(testConfig)
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle authentication errors
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
        
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        throw new Error('No questions received from server');
      }
    } catch (error) {
      console.error('Error generating test:', error);
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
    setCanMoveToNext(true);
  };

  const handleQuestionNavigation = (index) => {
    if (index >= 0 && index < questions.length && canMoveToNext) {
      setCurrentQuestionIndex(index);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0 && canMoveToNext) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1 && canMoveToNext) {
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

  const getAnsweredCount = () => Object.keys(answers).length;

  const handleSubmitTest = () => setShowSubmitModal(true);

  const handleAutoSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    submitTestAnswers();
  };

  const submitTestAnswers = async () => {
    try {
      setSubmitting(true);
      
      const endTime = new Date();
      const testAnswers = questions.map(question => ({
        questionId: question._id,
        selectedOption: answers[question._id] ?? -1,
        timeTaken: questionTimeSpent[question._id] || 0
      }));

      const submitData = {
        streamId: testConfig.streamId,
        subjectIds: testConfig.subjectIds,
        topicIds: testConfig.topicIds,
        answers: testAnswers,
        startTime: testStartTime.toISOString(),
        endTime: endTime.toISOString(),
        difficulty: testConfig.difficulty,
        cheatingAttempts,
        tabSwitchCount,
        questionTimeSpent
      };

      console.log('Submitting test data:', submitData);

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
        console.error('Test submission failed:', errorData);
        console.error('Response status:', response.status);
        throw new Error(errorData.error || errorData.message || 'Failed to submit test');
      }

      const result = await response.json();
      exitFullscreen();
      onTestComplete(result);

    } catch (error) {
      console.error('Error submitting test:', error);
      setError(error.message || 'Failed to submit test');
    } finally {
      setSubmitting(false);
      setShowSubmitModal(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  // Loading state with modern design
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-8"></div>
            <Shield className="w-8 h-8 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Preparing Your Secure Test
          </h2>
          <p className="text-gray-100 text-lg mb-6">Creating optimized questions for your skill level...</p>
          <div className="flex items-center justify-center space-x-2 text-blue-400">
            <Shield className="w-5 h-5" />
            <span className="font-medium">Secure Testing Environment Active</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state with modern design
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800/90 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 max-w-md mx-auto">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-white font-bold text-xl">Test Generation Failed</h3>
          </div>
          <p className="text-gray-100 mb-6">{error}</p>
          <div className="flex space-x-3">
            <button
              onClick={fetchTestQuestions}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
            >
              Retry
            </button>
            <button
              onClick={() => {
                exitFullscreen();
                onBackToSelection();
              }}
              className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-all duration-200"
            >
              Exit Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
  const timePercentage = (timeLeft / (Math.ceil(questions.length * 1.5) * 60)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900" style={{ userSelect: 'none' }}>
      {/* Enhanced Test Header - Responsive */}
      <div className="bg-gray-800/95 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Left - Question Info */}
            <div className="flex items-center space-x-3 sm:space-x-6 flex-1">
              <button
                onClick={() => {
                  if (window.confirm('⚠️ Exit test? All progress will be lost.')) {
                    exitFullscreen();
                    onBackToSelection();
                  }
                }}
                className="p-2 sm:p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl transition-all duration-200"
                title="Exit Test"
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-1">
                  <h1 className="text-sm sm:text-lg lg:text-xl font-bold text-white truncate">
                    <span className="hidden sm:inline">Question </span>{currentQuestionIndex + 1}/{questions.length}
                  </h1>
                  <div className="h-1.5 sm:h-2 w-16 sm:w-24 lg:w-32 bg-gray-700 rounded-full overflow-hidden flex-shrink-0">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
                <p className="text-gray-200 text-xs sm:text-sm hidden sm:block">
                  {getAnsweredCount()} answered • {flaggedQuestions.size} flagged
                </p>
              </div>
            </div>

            {/* Center - Timer with visual indicator */}
            <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="relative">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full border-2 sm:border-4 border-gray-600">
                    <div 
                      className={`absolute inset-0 rounded-full border-2 sm:border-4 border-transparent ${
                        timeLeft < 300 ? 'border-t-red-500' : 'border-t-blue-500'
                      } animate-pulse`}
                      style={{
                        background: `conic-gradient(${timeLeft < 300 ? '#ef4444' : '#3b82f6'} ${timePercentage * 3.6}deg, transparent 0deg)`
                      }}
                    />
                  </div>
                  <Timer className={`w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
                    timeLeft < 300 ? 'text-red-400' : 'text-blue-400'
                  }`} />
                </div>
                <div className="hidden sm:block">
                  <span className={`font-bold text-base sm:text-lg ${timeLeft < 300 ? 'text-red-400' : 'text-white'}`}>
                    {formatTime(timeLeft)}
                  </span>
                  <p className="text-gray-200 text-xs hidden lg:block">Time Left</p>
                </div>
                <div className="sm:hidden">
                  <span className={`font-bold text-sm ${timeLeft < 300 ? 'text-red-400' : 'text-white'}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
              
              {/* Security Status - Hidden on mobile */}
              <div className="hidden lg:flex items-center space-x-2">
                {isFullscreen ? (
                  <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 rounded-full">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">Secure</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 px-3 py-1 bg-red-500/20 rounded-full">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-sm font-medium">Warning</span>
                  </div>
                )}
                {tabSwitchCount > 0 && (
                  <div className="px-2 py-1 bg-yellow-500/20 rounded-full">
                    <span className="text-yellow-400 text-xs">⚠️ {tabSwitchCount}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right - Submit Button */}
            <button
              onClick={handleSubmitTest}
              className="px-3 sm:px-6 lg:px-8 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold text-sm sm:text-base transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <span className="hidden sm:inline">Submit Test</span>
              <span className="sm:hidden">Submit</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Enhanced Question Palette - Hidden on mobile, collapsible on tablet */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-gray-700/50 lg:sticky lg:top-28">
              <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 flex items-center">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-400" />
                Question Palette
              </h3>
              
              {/* Progress Stats */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="text-center p-2 sm:p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                  <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-400 mx-auto mb-1" />
                  <p className="text-green-400 font-bold text-base sm:text-lg">{getAnsweredCount()}</p>
                  <p className="text-green-300 text-xs">Answered</p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                  <Flag className="w-4 h-4 sm:w-6 sm:h-6 text-red-400 mx-auto mb-1" />
                  <p className="text-red-400 font-bold text-base sm:text-lg">{flaggedQuestions.size}</p>
                  <p className="text-red-300 text-xs">Flagged</p>
                </div>
              </div>

              {/* Status Legend */}
              <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6 text-xs sm:text-sm">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full shadow-lg"></div>
                  <span className="text-gray-100">Answered</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full shadow-lg"></div>
                  <span className="text-gray-100">Flagged</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full shadow-lg"></div>
                  <span className="text-gray-100">Current</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-600 rounded-full"></div>
                  <span className="text-gray-100">Not Visited</span>
                </div>
              </div>

              {/* Question Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-5 gap-1.5 sm:gap-2">
                {questions.map((_, index) => {
                  const status = getQuestionStatus(index);
                  let bgColor = 'bg-gray-600 hover:bg-gray-500';
                  let borderColor = 'border-gray-500';
                  
                  if (status === 'answered') {
                    bgColor = 'bg-green-500 hover:bg-green-400';
                    borderColor = 'border-green-400';
                  } else if (status === 'flagged') {
                    bgColor = 'bg-red-500 hover:bg-red-400';
                    borderColor = 'border-red-400';
                  } else if (status === 'current') {
                    bgColor = 'bg-blue-500 hover:bg-blue-400';
                    borderColor = 'border-blue-400';
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleQuestionNavigation(index)}
                      disabled={!canMoveToNext}
                      className={`w-8 h-8 sm:w-10 sm:h-10 ${bgColor} border-2 ${borderColor} text-white font-bold text-xs sm:text-sm rounded-xl transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Enhanced Main Question Area */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-700/50">
              {currentQuestion && (
                <>
                  {/* Question Header */}
                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-base sm:text-lg">{currentQuestionIndex + 1}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2 sm:space-x-3 mb-1 flex-wrap">
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                            currentQuestion.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            currentQuestion.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                            'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {currentQuestion.difficulty}
                          </span>
                          <span className="text-gray-200 text-xs sm:text-sm">
                            {Math.floor(Math.random() * 3) + 2} marks
                          </span>
                        </div>
                        <p className="text-gray-200 text-xs sm:text-sm">Single Correct Answer</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={toggleFlag}
                      className={`p-2 sm:p-3 rounded-xl transition-all duration-200 flex-shrink-0 ${
                        flaggedQuestions.has(currentQuestion._id)
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 border border-gray-600'
                      }`}
                    >
                      <Flag className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>

                  {/* Question Text */}
                    <div className="mb-6 sm:mb-8">
                      <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed whitespace-pre-wrap">
                        {currentQuestion.questionText}
                      </h2>
                    </div>

                  {/* Enhanced Answer Options */}
                  <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    {currentQuestion.options.map((option, index) => {
                      const isSelected = answers[currentQuestion._id] === index;
                      return (
                        <div
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          className={`group p-4 sm:p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 transform hover:scale-102 ${
                            isSelected
                              ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                              : 'border-gray-600 bg-gray-700/30 hover:border-gray-500 hover:bg-gray-700/50'
                          }`}
                          style={{ userSelect: 'none' }}
                        >
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                              isSelected
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-500 group-hover:border-gray-400'
                            }`}>
                              {isSelected && <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>}
                            </div>
                            <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
                              <span className={`font-bold text-base sm:text-lg flex-shrink-0 ${
                                isSelected ? 'text-blue-400' : 'text-gray-100'
                              }`}>
                                {String.fromCharCode(65 + index)}.
                              </span>
                              <span className="text-base sm:text-lg font-medium text-white">
                                {option.text}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Enhanced Navigation Buttons - Responsive */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <button
                      onClick={handlePrevious}
                      disabled={currentQuestionIndex === 0 || !canMoveToNext}
                      className="flex items-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-2 sm:py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 w-full sm:w-auto"
                    >
                      <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Previous</span>
                    </button>

                    <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
                      <button
                        onClick={() => handleAnswerSelect(-1)}
                        className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-xl font-medium transition-all duration-200 text-sm sm:text-base"
                      >
                        Clear
                      </button>
                      <button
                        onClick={toggleFlag}
                        className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 text-sm sm:text-base ${
                          flaggedQuestions.has(currentQuestion._id)
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        }`}
                      >
                        {flaggedQuestions.has(currentQuestion._id) ? 'Unflag' : 'Flag'}
                      </button>
                    </div>

                    <button
                      onClick={handleNext}
                      disabled={currentQuestionIndex === questions.length - 1 || !canMoveToNext}
                      className="flex items-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 w-full sm:w-auto"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Submit Modal - Responsive */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 max-w-sm sm:max-w-md mx-auto border border-gray-700 shadow-2xl w-full">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Send className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Submit Test?</h3>
              <p className="text-gray-100 mb-4 text-sm sm:text-base">
                You have answered <span className="font-bold text-green-400">{getAnsweredCount()}</span> out of <span className="font-bold">{questions.length}</span> questions.
              </p>
              {tabSwitchCount > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                  <p className="text-yellow-400 text-xs sm:text-sm">
                    ⚠️ {tabSwitchCount} security warnings detected during the test.
                  </p>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  disabled={submitting}
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-all duration-200 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={submitTestAnswers}
                  disabled={submitting}
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  {submitting ? (
                    <>
                      <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
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

// Enhanced Test Selection Flow Component
const TestSelectionFlow = ({ onStartTest }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [streams, setStreams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [streamResource, setStreamResource] = useState(null);
  
  const [selectedStream, setSelectedStream] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [testConfig, setTestConfig] = useState({
    numQuestions: 20,
    difficulty: 'Mixed',
    timeLimit: 30
  });

  const buildResourceLink = (url) => {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    if (url.startsWith('/')) return `${API_BASE_URL}${url}`;
    return `${API_BASE_URL}/${url}`;
  };

  useEffect(() => {
    fetchStreams();
  }, []);

  const fetchStreams = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_BASE_URL}/api/streams`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStreams(data || []);
    } catch (error) {
      console.error('Error fetching streams:', error);
      setError(`Failed to load streams: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async (streamId) => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_BASE_URL}/api/subjects/stream/${streamId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSubjects(data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setError(`Failed to load subjects: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async (subjectIds) => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching topics for subject IDs:', subjectIds);
      
      const response = await fetch(`${API_BASE_URL}/api/topics/subjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjectIds })
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Topics received:', data);
      setTopics(data || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
      setError(`Failed to load topics: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStreamSelect = (stream) => {
    setSelectedStream(stream);
    setSelectedSubjects([]);
    setSelectedTopics([]);
    const resourceInfo = stream?.resourceType && stream?.resourceUrl
      ? {
          type: stream.resourceType,
          url: stream.resourceUrl,
          title: stream.resourceTitle || `${stream.name} resource`,
          description: stream.resourceDescription || ''
        }
      : null;
    setStreamResource(resourceInfo);
    fetchSubjects(stream._id);
    setCurrentStep(2);
  };

  const handleSubjectToggle = (subject) => {
    const isSelected = selectedSubjects.find(s => s._id === subject._id);
    if (isSelected) {
      setSelectedSubjects(selectedSubjects.filter(s => s._id !== subject._id));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
    setSelectedTopics([]);
  };

  const handleSubjectsNext = () => {
    if (selectedSubjects.length > 0) {
      const subjectIds = selectedSubjects.map(s => s._id);
      fetchTopics(subjectIds);
      setCurrentStep(3);
    }
  };

  const handleTopicToggle = (topic) => {
    const isSelected = selectedTopics.find(t => t._id === topic._id);
    if (isSelected) {
      setSelectedTopics(selectedTopics.filter(t => t._id !== topic._id));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleSelectAllTopics = () => {
    if (selectedTopics.length === topics.length) {
      setSelectedTopics([]);
    } else {
      setSelectedTopics([...topics]);
    }
  };

  const handleTopicsNext = () => {
    setCurrentStep(4);
  };

  const handleStartTest = () => {
    const testData = {
      streamId: selectedStream._id,
      subjectIds: selectedSubjects.map(s => s._id),
      topicIds: selectedTopics.map(t => t._id),
      numQuestions: testConfig.numQuestions,
      difficulty: testConfig.difficulty
    };
    onStartTest(testData);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8 sm:mb-12 lg:mb-16 px-4">
      {[
        { step: 1, label: 'Stream', icon: BookOpen },
        { step: 2, label: 'Subjects', icon: Target },
        { step: 3, label: 'Topics', icon: Lightbulb },
        { step: 4, label: 'Configure', icon: Settings }
      ].map(({ step, label, icon: Icon }, index) => (
        <div key={step} className="flex items-center">
          <div className="text-center">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-sm sm:text-base lg:text-lg transition-all duration-500 ${
              step <= currentStep 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25' 
                : 'bg-gray-700 text-gray-400 border-2 border-gray-600'
            }`}>
              {step <= currentStep ? (
                step < currentStep ? <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" /> : <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
              ) : <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />}
            </div>
            <p className={`mt-2 sm:mt-3 text-xs sm:text-sm font-bold transition-all duration-300 ${
              step <= currentStep ? 'text-blue-400' : 'text-gray-400'
            }`}>
              {label}
            </p>
          </div>
          {index < 3 && (
            <div className={`w-8 sm:w-16 lg:w-24 h-1 mx-2 sm:mx-4 lg:mx-6 rounded-full transition-all duration-500 ${
              step < currentStep ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-700'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStreamSelection = () => {
    if (loading) {
      return (
        <div className="flex flex-col justify-center items-center h-64 space-y-6">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-blue-400 font-bold text-2xl">Loading streams...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md mx-auto">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <h3 className="text-red-400 font-bold text-xl">Error</h3>
          </div>
          <p className="text-red-300 font-medium mb-6">{error}</p>
          <button
            onClick={fetchStreams}
            className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all duration-200"
          >
            Retry
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-8 sm:space-y-12 px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Choose Your Stream
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-100">Select the competitive exam you want to practice for</p>
        </div>
        
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-green-500/10 border border-green-500/20 rounded-full">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mr-2" />
            <span className="text-green-400 font-bold text-sm sm:text-base">
              Found {streams.length} streams in database
            </span>
          </div>
        </div>
        
        {streams.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <AlertCircle className="w-16 h-16 sm:w-20 sm:h-20 text-red-400 mx-auto mb-4 sm:mb-6" />
            <p className="text-2xl sm:text-3xl font-black text-red-400 mb-3 sm:mb-4">No streams available</p>
            <p className="text-lg sm:text-xl font-bold text-gray-100 mb-6 sm:mb-8">Make sure your backend is running and seeded</p>
            <button
              onClick={fetchStreams}
              className="px-6 sm:px-10 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-base sm:text-lg transition-all duration-200 transform hover:scale-105"
            >
              Retry Loading
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {streams.map((stream, index) => (
              <div
                key={stream._id || index}
                onClick={() => handleStreamSelect(stream)}
                className="group bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 sm:p-8 cursor-pointer hover:bg-gray-700/50 transition-all duration-300 border-2 border-gray-700 hover:border-blue-500 transform hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-blue-500/25"
                style={{ minHeight: '250px' }}
              >
                <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6 h-full">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl sm:text-3xl font-black text-white mb-3 sm:mb-4 group-hover:text-blue-400 transition-colors duration-300">
                      {stream.name || `Stream ${index + 1}`}
                    </h3>
                    <p className="text-base sm:text-lg font-medium text-gray-100 leading-relaxed">
                      {stream.description || 'No description available'}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center w-full pt-3 sm:pt-4 border-t border-gray-600">
                    <div className="flex items-center space-x-2 sm:space-x-3 text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
                      <span className="font-black text-base sm:text-lg">Select Stream</span>
                      <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderSubjectSelection = () => {
    if (loading) {
      return (
        <div className="flex flex-col justify-center items-center h-64 space-y-6">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-blue-400 font-bold text-2xl">Loading subjects...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md mx-auto">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <h3 className="text-red-400 font-bold text-xl">Error</h3>
          </div>
          <p className="text-red-300 font-medium mb-6">{error}</p>
          <button
            onClick={() => fetchSubjects(selectedStream._id)}
            className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all duration-200"
          >
            Retry
          </button>
        </div>
      );
    }

    if (!loading && subjects.length === 0 && streamResource) {
      const resourceHref = buildResourceLink(streamResource.url);
      return (
        <div className="space-y-8 sm:space-y-12 px-4">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Download Exam Resource
            </h2>
            <p className="text-lg sm:text-xl font-bold text-gray-100">
              {selectedStream?.name} is a resource-only stream with no subjects.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-gray-800/60 border border-gray-700 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 sm:p-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 sm:p-4 bg-blue-500/20 rounded-2xl">
                  <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-blue-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">
                    {streamResource.title || selectedStream?.name}
                  </h3>
                  <p className="text-sm text-gray-300">
                    {streamResource.description || 'Access the official set of questions for this Capgemini pseudo coding assessment.'}
                  </p>
                </div>
              </div>

              {selectedStream?.description && (
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
                  {selectedStream.description}
                </p>
              )}

              <div className="bg-black/20 border border-gray-700 rounded-2xl p-4 sm:p-6 text-sm sm:text-base text-gray-200">
                There are no subjects or topics associated with this stream. Use the resource below to access the question PDF directly.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href={resourceHref || '#'}
                  target={resourceHref ? '_blank' : undefined}
                  rel={resourceHref ? 'noopener noreferrer' : undefined}
                  className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold transition-colors ${
                    resourceHref
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  <span>{resourceHref ? 'Open PDF Resource' : 'PDF link pending'}</span>
                </a>
                <button
                  onClick={() => {
                    setSelectedStream(null);
                    setStreamResource(null);
                    setSelectedSubjects([]);
                    setSelectedTopics([]);
                    setCurrentStep(1);
                  }}
                  className="px-5 py-3 rounded-2xl font-bold bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                >
                  Back to Streams
                </button>
              </div>

              {streamResource.url && (
                <p className="text-xs text-gray-400 break-all">
                  Direct link: {resourceHref}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8 sm:space-y-12 px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Select Subjects
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-100 mb-4 sm:mb-6">
            Choose subjects for <span className="text-blue-400 font-black">{selectedStream?.name}</span> examination
          </p>
          <div className="inline-flex items-center px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 bg-blue-600/20 border border-blue-500/30 rounded-2xl">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-400 mr-2 sm:mr-3" />
            <span className="text-blue-400 text-sm sm:text-base lg:text-xl font-bold">
              {selectedSubjects.length} subjects selected
            </span>
          </div>
        </div>

        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-green-500/10 border border-green-500/20 rounded-full">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mr-2" />
            <span className="text-green-400 font-bold text-sm sm:text-base">
              Found {subjects.length} subjects for {selectedStream?.name}
            </span>
          </div>
        </div>

        {subjects.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <AlertCircle className="w-16 h-16 sm:w-20 sm:h-20 text-red-400 mx-auto mb-4 sm:mb-6" />
            <p className="text-2xl sm:text-3xl font-black text-red-400 mb-3 sm:mb-4">No subjects available</p>
            <p className="text-lg sm:text-xl font-bold text-gray-300 mb-6 sm:mb-8">No subjects found for this stream</p>
            <button
              onClick={() => fetchSubjects(selectedStream._id)}
              className="px-6 sm:px-10 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-base sm:text-lg transition-all duration-200 transform hover:scale-105"
            >
              Retry Loading
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {subjects.map((subject, index) => {
              const isSelected = selectedSubjects.find(s => s._id === subject._id);
              
              return (
                <div
                  key={subject._id || index}
                  onClick={() => handleSubjectToggle(subject)}
                  className={`group p-4 sm:p-6 lg:p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 shadow-xl shadow-blue-500/25'
                      : 'bg-gray-800/50 border-gray-600 hover:border-gray-500 shadow-xl'
                  }`}
                  style={{ minHeight: '160px' }}
                >
                  <div className="flex items-center justify-between h-full">
                    <div className="flex-1">
                      <h3 className={`font-black text-lg sm:text-xl lg:text-2xl mb-2 sm:mb-3 transition-colors duration-300 ${
                        isSelected ? 'text-blue-300' : 'text-white group-hover:text-blue-400'
                      }`}>
                        {subject.name || `Subject ${index + 1}`}
                      </h3>
                      {subject.description && (
                        <p className="text-gray-100 font-medium text-sm sm:text-base">{subject.description}</p>
                      )}
                    </div>
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center ml-3 sm:ml-6 transition-all duration-300 ${
                      isSelected 
                        ? 'bg-blue-600 border-blue-600 scale-110' 
                        : 'border-gray-500 group-hover:border-gray-400'
                    }`}>
                      {isSelected && <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 max-w-6xl mx-auto pt-6 sm:pt-8">
          <button
            onClick={() => setCurrentStep(1)}
            className="flex items-center space-x-3 px-6 sm:px-8 py-3 sm:py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-2xl font-bold text-base sm:text-lg transition-all duration-200 w-full sm:w-auto"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>Back</span>
          </button>
          <button
            onClick={handleSubjectsNext}
            disabled={selectedSubjects.length === 0}
            className="flex items-center space-x-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed font-bold text-base sm:text-lg shadow-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
          >
            <span>Next ({selectedSubjects.length} selected)</span>
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    );
  };

  const renderTopicSelection = () => {
    if (loading) {
      return (
        <div className="flex flex-col justify-center items-center h-64 space-y-6">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-blue-400 font-bold text-2xl">Loading topics...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md mx-auto">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <h3 className="text-red-400 font-bold text-xl">Error</h3>
          </div>
          <p className="text-red-300 font-medium mb-6">{error}</p>
          <button
            onClick={() => fetchTopics(selectedSubjects.map(s => s._id))}
            className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all duration-200"
          >
            Retry
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-8 sm:space-y-12 px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Select Topics
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-100 mb-4 sm:mb-6">
            Choose specific topics from {selectedSubjects.map(s => s.name).join(', ')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 max-w-6xl mx-auto">
          <div className="flex items-center px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-blue-600/20 border border-blue-500/30 rounded-2xl">
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-400 mr-2 sm:mr-3" />
            <span className="text-blue-400 font-bold text-sm sm:text-base lg:text-xl">
              {selectedTopics.length} of {topics.length} topics selected
            </span>
          </div>
          <button
            onClick={handleSelectAllTopics}
            className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
          >
            {selectedTopics.length === topics.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        {topics.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <AlertCircle className="w-16 h-16 sm:w-20 sm:h-20 text-red-400 mx-auto mb-4 sm:mb-6" />
            <p className="text-2xl sm:text-3xl font-black text-red-400 mb-3 sm:mb-4">No topics available</p>
            <p className="text-lg sm:text-xl font-bold text-gray-100">No topics found for selected subjects</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {topics.map((topic, index) => {
              const isSelected = selectedTopics.find(t => t._id === topic._id);
              return (
                <div
                  key={topic._id || index}
                  onClick={() => handleTopicToggle(topic)}
                  className={`group p-4 sm:p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-lg shadow-blue-500/25'
                      : 'bg-gray-800/50 border-gray-600 text-white hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm sm:text-base lg:text-lg pr-2">
                      {topic.name || `Topic ${index + 1}`}
                    </span>
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                      isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-500'
                    }`}>
                      {isSelected && <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 max-w-6xl mx-auto pt-6 sm:pt-8">
          <button
            onClick={() => setCurrentStep(2)}
            className="flex items-center space-x-3 px-6 sm:px-8 py-3 sm:py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-2xl font-bold text-base sm:text-lg transition-all duration-200 w-full sm:w-auto"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>Back</span>
          </button>
          <button
            onClick={handleTopicsNext}
            disabled={selectedTopics.length === 0}
            className="flex items-center space-x-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed font-bold text-base sm:text-lg shadow-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
          >
            <span className="hidden sm:inline">Configure Test ({selectedTopics.length} topics)</span>
            <span className="sm:hidden">Configure ({selectedTopics.length})</span>
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    );
  };

  const renderTestConfiguration = () => (
    <div className="space-y-8 sm:space-y-12 px-4">
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Configure Your Test
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-100 mb-6 sm:mb-8">Set the number of questions and difficulty level</p>
        
        {/* Enhanced Security Notice */}
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/30 rounded-2xl p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <Shield className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-400" />
            <span className="text-blue-400 font-bold text-base sm:text-lg lg:text-xl">Secure Testing Environment</span>
          </div>
          <p className="text-blue-100 text-sm sm:text-base lg:text-lg leading-relaxed">
            Once started, this test will run in fullscreen mode. Tab switching, copying, and other activities will be monitored for security.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-700/50">
            <label className="block text-white font-black text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6 flex items-center">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-400" />
              Number of Questions
            </label>
            <select
              value={testConfig.numQuestions}
              onChange={(e) => setTestConfig({...testConfig, numQuestions: parseInt(e.target.value)})}
              className="w-full p-3 sm:p-4 lg:p-6 bg-gray-700 border-2 border-gray-600 rounded-xl text-white font-bold text-base sm:text-lg lg:text-xl focus:border-blue-500 focus:outline-none transition-all duration-200"
            >
              <option value={10}>10 Questions (Quick - 15 mins)</option>
              <option value={20}>20 Questions (Standard - 30 mins)</option>
              <option value={30}>30 Questions (Medium - 45 mins)</option>
              <option value={50}>50 Questions (Long - 75 mins)</option>
              <option value={100}>100 Questions (Full - 150 mins)</option>
            </select>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-700/50">
            <label className="block text-white font-black text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6 flex items-center">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-purple-400" />
              Difficulty Level
            </label>
            <select
              value={testConfig.difficulty}
              onChange={(e) => setTestConfig({...testConfig, difficulty: e.target.value})}
              className="w-full p-3 sm:p-4 lg:p-6 bg-gray-700 border-2 border-gray-600 rounded-xl text-white font-bold text-base sm:text-lg lg:text-xl focus:border-blue-500 focus:outline-none transition-all duration-200"
            >
              <option value="Easy">🟢 Easy - Beginner Level</option>
              <option value="Medium">🟡 Medium - Intermediate</option>
              <option value="Hard">🔴 Hard - Advanced</option>
              <option value="Mixed">🎯 Mixed - All Levels</option>
            </select>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-xl rounded-2xl p-6 sm:p-8 lg:p-10 border border-gray-700/50 shadow-2xl">
          <div className="flex items-center space-x-3 sm:space-x-4 mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">Test Summary</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-700/30 rounded-xl">
                <span className="text-gray-100 font-bold text-sm sm:text-base lg:text-lg">Stream:</span>
                <span className="text-blue-400 font-black text-sm sm:text-base lg:text-lg">{selectedStream?.name}</span>
              </div>
              <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-700/30 rounded-xl">
                <span className="text-gray-100 font-bold text-sm sm:text-base lg:text-lg">Subjects:</span>
                <span className="text-white font-black text-sm sm:text-base lg:text-lg">{selectedSubjects.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-700/30 rounded-xl">
                <span className="text-gray-100 font-bold text-sm sm:text-base lg:text-lg">Topics:</span>
                <span className="text-white font-black text-sm sm:text-base lg:text-lg">{selectedTopics.length}</span>
              </div>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-700/30 rounded-xl">
                <span className="text-gray-100 font-bold text-sm sm:text-base lg:text-lg">Questions:</span>
                <span className="text-blue-400 font-black text-sm sm:text-base lg:text-lg">{testConfig.numQuestions}</span>
              </div>
              <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-700/30 rounded-xl">
                <span className="text-gray-100 font-bold text-sm sm:text-base lg:text-lg">Difficulty:</span>
                <span className="text-white font-black text-sm sm:text-base lg:text-lg">{testConfig.difficulty}</span>
              </div>
              <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-700/30 rounded-xl">
                <span className="text-gray-100 font-bold text-sm sm:text-base lg:text-lg">Time Limit:</span>
                <span className="text-orange-400 font-black text-sm sm:text-base lg:text-lg">{Math.ceil(testConfig.numQuestions * 1.5)} minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 max-w-5xl mx-auto pt-6 sm:pt-8">
        <button
          onClick={() => setCurrentStep(3)}
          className="flex items-center space-x-3 px-6 sm:px-8 py-3 sm:py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-2xl font-bold text-base sm:text-lg transition-all duration-200 w-full sm:w-auto"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          <span>Back</span>
        </button>
        <button
          onClick={handleStartTest}
          className="flex items-center space-x-2 sm:space-x-4 px-6 sm:px-8 lg:px-12 py-4 sm:py-5 lg:py-6 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 hover:from-green-700 hover:via-emerald-700 hover:to-green-700 text-white rounded-2xl font-black text-lg sm:text-xl lg:text-2xl shadow-2xl transform hover:scale-105 transition-all duration-200 w-full sm:w-auto"
        >
          <Shield className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
          <span className="hidden sm:inline">START SECURE TEST</span>
          <span className="sm:hidden">START TEST</span>
          <Rocket className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {renderStepIndicator()}
      
      {currentStep === 1 && renderStreamSelection()}
      {currentStep === 2 && renderSubjectSelection()}
      {currentStep === 3 && renderTopicSelection()}
      {currentStep === 4 && renderTestConfiguration()}
    </div>
  );
};

// Enhanced Test Results Component Import
import TestResults from '../components/TestResults';
import TestHistory from '../components/TestHistory';

// Main TestSection Component
const TestSection = () => {
  const [currentView, setCurrentView] = useState('selection'); // selection, test, result, history
  const [testData, setTestData] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const navigate = useNavigate();

  const handleStartTest = (config) => {
    setTestData(config);
    setCurrentView('test');
  };

  const handleTestComplete = (result) => {
    setTestResult(result);
    setCurrentView('result');
  };

  const handleBackToSelection = () => {
    setCurrentView('selection');
    setTestData(null);
    setTestResult(null);
  };

  const handleRetakeTest = () => {
    if (testData) {
      setCurrentView('test');
      setTestResult(null);
    } else {
      handleBackToSelection();
    }
  };

  const handleViewHistory = () => {
    setCurrentView('history');
  };

  const handleViewTestResult = (testId) => {
    console.log('View test result:', testId);
  };

  const handleRetakeFromHistory = (test) => {
    const config = {
      streamId: test.stream?._id,
      subjectIds: test.subjects?.map(s => s._id) || [],
      topicIds: test.topics?.map(t => t._id) || [],
      numQuestions: test.totalQuestions,
      difficulty: test.difficulty
    };
    handleStartTest(config);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 test-section-text">
      {/* Enhanced Navigation Header - Responsive */}
      {(currentView === 'selection' || currentView === 'history') && (
        <div className="bg-gray-800/95 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={() => navigate('/')}
                  className="p-2 sm:p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl transition-all duration-200"
                >
                  <Home className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <div>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Test Center
                  </h1>
                  <p className="text-gray-200 text-xs sm:text-sm hidden sm:block">Practice with real exam questions</p>
                </div>
              </div>

              <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                  onClick={() => setCurrentView('selection')}
                  className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 ${
                    currentView === 'selection'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-200 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">New Test</span>
                    <span className="sm:hidden">New</span>
                  </div>
                </button>
                <button
                  onClick={handleViewHistory}
                  className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 ${
                    currentView === 'history'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-200 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>History</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={(currentView === 'selection' || currentView === 'history') ? 'py-8' : ''}>
        {currentView === 'selection' && (
          <TestSelectionFlow onStartTest={handleStartTest} />
        )}
        
        {currentView === 'test' && testData && (
          <TestInterface 
            testConfig={testData}
            onTestComplete={handleTestComplete}
            onBackToSelection={handleBackToSelection}
          />
        )}
        
        {currentView === 'result' && testResult && (
          <TestResults 
            testResult={testResult}
            onBackToSelection={handleBackToSelection}
            onRetakeTest={handleRetakeTest}
          />
        )}

        {currentView === 'history' && (
          <div className="-mt-8">
            <TestHistory 
              onViewResult={handleViewTestResult}
              onRetakeTest={handleRetakeFromHistory}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TestSection;
