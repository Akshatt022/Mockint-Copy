import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  BookOpen, Clock, Target, TrendingUp, Star, ArrowRight, Users, Award,
  Play, ChevronLeft, ChevronRight, Flag, CheckCircle, XCircle, RotateCcw,
  Home, FileText, BarChart3, Settings, Filter, Zap, Brain, Award as Trophy,
  Loader, AlertCircle, Timer, ArrowLeft, Send, Shield, Eye, EyeOff
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:5000/api';

// Anti-Cheating Test Interface Component
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

  // Anti-cheating: Enter fullscreen when test starts
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

  // Anti-cheating: Exit fullscreen
  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }, []);

  // Anti-cheating: Log cheating attempts
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

  // Anti-cheating: Disable text selection and context menu
  useEffect(() => {
    const disableSelection = (e) => {
      e.preventDefault();
      return false;
    };

    const disableContextMenu = (e) => {
      e.preventDefault();
      logCheatingAttempt('RIGHT_CLICK', 'Attempted to open context menu');
      return false;
    };

    const disableKeyboardShortcuts = (e) => {
      // Disable common shortcuts
      if (
        e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'a' || e.key === 's' || e.key === 'p') ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.key === 'u') ||
        e.key === 'F5' ||
        (e.ctrlKey && e.key === 'r')
      ) {
        e.preventDefault();
        logCheatingAttempt('KEYBOARD_SHORTCUT', `Attempted to use: ${e.ctrlKey ? 'Ctrl+' : ''}${e.shiftKey ? 'Shift+' : ''}${e.key}`);
        return false;
      }
    };

    // Add event listeners
    document.addEventListener('selectstart', disableSelection);
    document.addEventListener('dragstart', disableSelection);
    document.addEventListener('contextmenu', disableContextMenu);
    document.addEventListener('keydown', disableKeyboardShortcuts);

    // CSS to disable text selection
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.mozUserSelect = 'none';
    document.body.style.msUserSelect = 'none';

    return () => {
      document.removeEventListener('selectstart', disableSelection);
      document.removeEventListener('dragstart', disableSelection);
      document.removeEventListener('contextmenu', disableContextMenu);
      document.removeEventListener('keydown', disableKeyboardShortcuts);
      
      // Restore text selection
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      document.body.style.mozUserSelect = '';
      document.body.style.msUserSelect = '';
    };
  }, [logCheatingAttempt]);

  // Anti-cheating: Monitor tab switching and page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => prev + 1);
        logCheatingAttempt('TAB_SWITCH', `Switched away from test tab. Count: ${tabSwitchCount + 1}`);
        
        // Warning after 3 tab switches
        if (tabSwitchCount >= 2) {
          alert('⚠️ WARNING: Multiple tab switches detected. Your test may be terminated for suspicious activity.');
        }
        
        // Auto-submit after 5 tab switches
        if (tabSwitchCount >= 4) {
          logCheatingAttempt('AUTO_SUBMIT', 'Test auto-submitted due to excessive tab switching');
          handleAutoSubmit();
        }
      }
    };

    const handleFocus = () => {
      if (!isFullscreen && questions.length > 0) {
        enterFullscreen();
      }
    };

    const handleBlur = () => {
      logCheatingAttempt('WINDOW_BLUR', 'Window lost focus');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isFullscreen, tabSwitchCount, questions.length, enterFullscreen, logCheatingAttempt]);

  // Anti-cheating: Monitor fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
      setIsFullscreen(!!fullscreenElement);
      
      if (!fullscreenElement && questions.length > 0) {
        logCheatingAttempt('FULLSCREEN_EXIT', 'Attempted to exit fullscreen mode');
        setTimeout(() => {
          enterFullscreen();
        }, 1000);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, [questions.length, enterFullscreen, logCheatingAttempt]);

  // Question timing for anti-cheating
  useEffect(() => {
    if (questions.length > 0) {
      setQuestionStartTime(Date.now());
      setCanMoveToNext(false);
      
      // Minimum time per question (10 seconds)
      const timer = setTimeout(() => {
        setCanMoveToNext(true);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [currentQuestionIndex, questions.length]);

  // Track time spent on each question
  useEffect(() => {
    const interval = setInterval(() => {
      if (questionStartTime && questions.length > 0) {
        const timeSpent = Date.now() - questionStartTime;
        setQuestionTimeSpent(prev => ({
          ...prev,
          [questions[currentQuestionIndex]?._id]: timeSpent
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [questionStartTime, currentQuestionIndex, questions]);

  // Fetch questions when component mounts
  useEffect(() => {
    fetchTestQuestions();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current);
      }
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
      
      // Enter fullscreen mode
      setTimeout(() => {
        enterFullscreen();
      }, 1000);
    }
  }, [questions, testStartTime, enterFullscreen]);

  const fetchTestQuestions = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/tests/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(testConfig)
      });

      if (!response.ok) {
        const errorData = await response.json();
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
    
    // Allow moving to next question after answering
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
        // Anti-cheating data
        cheatingAttempts,
        tabSwitchCount,
        questionTimeSpent
      };

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/tests/submit`, {
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
      
      // Exit fullscreen after test submission
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-blue-400 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Generating Your Test</h2>
          <p className="text-gray-400">Please wait while we prepare your questions...</p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Secure Testing Environment</span>
          </div>
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
            <AlertCircle className="w-8 h-8 text-white" />
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
              onClick={() => {
                exitFullscreen();
                onBackToSelection();
              }}
              className="px-4 py-2 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 flex-1"
            >
              Exit Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900" style={{ userSelect: 'none' }}>
      {/* Test Header with Anti-Cheating Indicators */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Question info */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to exit the test? All progress will be lost.')) {
                    exitFullscreen();
                    onBackToSelection();
                  }
                }}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
                title="Exit Test"
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

            {/* Center - Timer and Security Status */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Timer className={`w-5 h-5 ${timeLeft < 300 ? 'text-red-400' : 'text-blue-400'}`} />
                <span className={`font-bold text-lg ${timeLeft < 300 ? 'text-red-400' : 'text-white'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              
              {/* Security indicators */}
              <div className="flex items-center space-x-2">
                {isFullscreen ? (
                  <div className="flex items-center space-x-1">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-xs">Secure</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-xs">Not Secure</span>
                  </div>
                )}
                {tabSwitchCount > 0 && (
                  <div className="text-red-400 text-xs">
                    Warnings: {tabSwitchCount}
                  </div>
                )}
              </div>
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
              
              {/* Navigation Restriction Notice */}
              {!canMoveToNext && (
                <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-yellow-700" />
                    <span className="text-yellow-700 text-sm font-medium">
                      Please wait 10s or answer to continue
                    </span>
                  </div>
                </div>
              )}
              
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
                      disabled={!canMoveToNext}
                      className={`w-8 h-8 ${bgColor} text-white font-bold text-sm rounded hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
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
                    <div className="flex items-center space-x-3">
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
                  </div>

                  {/* Question Text */}
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 leading-relaxed">
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
                          style={{ userSelect: 'none' }}
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
                      disabled={currentQuestionIndex === 0 || !canMoveToNext}
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
                      <button
                        onClick={() => setCanMoveToNext(true)}
                        disabled={canMoveToNext}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Skip Question
                      </button>
                    </div>

                    <button
                      onClick={handleNext}
                      disabled={currentQuestionIndex === questions.length - 1 || !canMoveToNext}
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
              <p className="text-gray-600 mb-4">
                You have answered {getAnsweredCount()} out of {questions.length} questions. 
                Are you sure you want to submit your test?
              </p>
              {tabSwitchCount > 0 && (
                <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-3 mb-4">
                  <p className="text-yellow-700 text-sm">
                    ⚠️ Warning: {tabSwitchCount} suspicious activities detected during the test.
                  </p>
                </div>
              )}
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

// Test Selection Flow Component (Previous code remains the same)
const TestSelectionFlow = ({ onStartTest }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [streams, setStreams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  
  const [selectedStream, setSelectedStream] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [testConfig, setTestConfig] = useState({
    numQuestions: 20,
    difficulty: 'Mixed',
    timeLimit: 30
  });

  useEffect(() => {
    fetchStreams();
  }, []);

  const fetchStreams = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_BASE}/streams`);
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
      const response = await fetch(`${API_BASE}/subjects/stream/${streamId}`);
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
      const response = await fetch(`${API_BASE}/topics/subjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjectIds })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
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
    <div className="flex items-center justify-center mb-12">
      {[
        { step: 1, label: 'Stream' },
        { step: 2, label: 'Subjects' },
        { step: 3, label: 'Topics' },
        { step: 4, label: 'Configure' }
      ].map(({ step, label }, index) => (
        <div key={step} className="flex items-center">
          <div className="text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
              step <= currentStep 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-gray-600 text-white border-2 border-gray-400'
            }`}>
              {step <= currentStep ? (
                step < currentStep ? <CheckCircle className="w-6 h-6 text-white" /> : step
              ) : step}
            </div>
            <p className={`mt-2 text-sm font-bold ${
              step <= currentStep ? 'text-blue-400' : 'text-white'
            }`}>
              {label}
            </p>
          </div>
          {index < 3 && (
            <div className={`w-20 h-1 mx-4 rounded-full transition-all duration-300 ${
              step < currentStep ? 'bg-blue-600' : 'bg-gray-600'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStreamSelection = () => {
    if (loading) {
      return (
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <Loader className="w-12 h-12 text-blue-400 animate-spin" />
          <p className="text-blue-400 font-bold text-2xl">Loading streams...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-600 border-4 border-red-800 rounded-xl p-8 max-w-md mx-auto">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-8 h-8 text-white" />
            <h3 className="text-white font-bold text-xl">Error</h3>
          </div>
          <p className="text-white font-medium mb-4">{error}</p>
          <button
            onClick={fetchStreams}
            className="px-6 py-3 bg-white text-red-600 rounded-lg font-bold hover:bg-gray-100"
          >
            Retry
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-5xl font-black text-white mb-6 drop-shadow-lg">
            Choose Your Stream
          </h2>
          <p className="text-2xl font-bold text-gray-300">Select the competitive exam you want to practice for</p>
        </div>
        
        <div className="text-center mb-8">
          <p className="text-xl font-bold text-green-400">
            ✅ Found {streams.length} streams in database
          </p>
        </div>
        
        {streams.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-3xl font-black text-red-400">⚠️ No streams available</p>
            <p className="text-xl font-bold text-white mt-4">Make sure your backend is running and seeded</p>
            <button
              onClick={fetchStreams}
              className="mt-6 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-black text-lg"
            >
              Retry Loading
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {streams.map((stream, index) => (
              <div
                key={stream._id || index}
                onClick={() => handleStreamSelect(stream)}
                className="bg-white rounded-2xl p-8 cursor-pointer hover:bg-blue-50 transition-all duration-300 border-4 border-gray-800 hover:border-blue-600 transform hover:scale-105 shadow-2xl"
                style={{ minHeight: '200px' }}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-white" />
                  </div>
                  
                  <div className="w-full">
                    <h3 className="text-3xl font-black text-gray-900 mb-3">
                      {stream.name || `Stream ${index + 1}`}
                    </h3>
                    <p className="text-lg font-bold text-gray-700 leading-relaxed">
                      {stream.description || 'No description available'}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center w-full pt-4 border-t-2 border-gray-300">
                    <span className="text-blue-600 font-black text-lg mr-3">Click to select</span>
                    <ArrowRight className="w-6 h-6 text-blue-600" />
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
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <Loader className="w-12 h-12 text-blue-400 animate-spin" />
          <p className="text-blue-400 font-bold text-2xl">Loading subjects...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-600 border-4 border-red-800 rounded-xl p-8 max-w-md mx-auto">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-8 h-8 text-white" />
            <h3 className="text-white font-bold text-xl">Error</h3>
          </div>
          <p className="text-white font-medium mb-4">{error}</p>
          <button
            onClick={() => fetchSubjects(selectedStream._id)}
            className="px-6 py-3 bg-white text-red-600 rounded-lg font-bold hover:bg-gray-100"
          >
            Retry
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-5xl font-black text-white mb-6">Select Subjects</h2>
          <p className="text-2xl font-bold text-gray-300">
            Choose subjects for <span className="text-blue-400 font-black">{selectedStream?.name}</span> examination
          </p>
          <div className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600 rounded-full">
            <span className="text-white text-lg font-bold">
              {selectedSubjects.length} subjects selected
            </span>
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-xl font-bold text-green-400">
            ✅ Found {subjects.length} subjects for {selectedStream?.name}
          </p>
        </div>

        {subjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-3xl font-black text-red-400">⚠️ No subjects available</p>
            <p className="text-xl font-bold text-white mt-4">No subjects found for this stream</p>
            <button
              onClick={() => fetchSubjects(selectedStream._id)}
              className="mt-6 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-black text-lg"
            >
              Retry Loading
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {subjects.map((subject, index) => {
              const isSelected = selectedSubjects.find(s => s._id === subject._id);
              
              return (
                <div
                  key={subject._id || index}
                  onClick={() => handleSubjectToggle(subject)}
                  className={`p-8 rounded-2xl border-4 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    isSelected
                      ? 'bg-blue-100 border-blue-600 shadow-2xl shadow-blue-500/50'
                      : 'bg-white border-gray-400 hover:border-blue-600 shadow-xl'
                  }`}
                  style={{ minHeight: '150px' }}
                >
                  <div className="flex items-center justify-between h-full">
                    <div className="flex-1">
                      <h3 className={`font-black text-2xl mb-2 ${
                        isSelected ? 'text-blue-800' : 'text-gray-900'
                      }`}>
                        {subject.name || `Subject ${index + 1}`}
                      </h3>
                      {subject.description && (
                        <p className="text-gray-700 font-medium text-base">{subject.description}</p>
                      )}
                    </div>
                    <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center ml-4 ${
                      isSelected 
                        ? 'bg-blue-600 border-blue-600' 
                        : 'border-gray-400'
                    }`}>
                      {isSelected && <CheckCircle className="w-6 h-6 text-white" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-between max-w-6xl mx-auto pt-8">
          <button
            onClick={() => setCurrentStep(1)}
            className="flex items-center space-x-3 px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-bold text-lg"
          >
            <ChevronLeft className="w-6 h-6" />
            <span>Back</span>
          </button>
          <button
            onClick={handleSubjectsNext}
            disabled={selectedSubjects.length === 0}
            className="flex items-center space-x-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg"
          >
            <span>Next ({selectedSubjects.length} selected)</span>
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  };

  const renderTopicSelection = () => {
    if (loading) {
      return (
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <Loader className="w-12 h-12 text-blue-400 animate-spin" />
          <p className="text-blue-400 font-bold text-2xl">Loading topics...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-600 border-4 border-red-800 rounded-xl p-8 max-w-md mx-auto">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-8 h-8 text-white" />
            <h3 className="text-white font-bold text-xl">Error</h3>
          </div>
          <p className="text-white font-medium mb-4">{error}</p>
          <button
            onClick={() => fetchTopics(selectedSubjects.map(s => s._id))}
            className="px-6 py-3 bg-white text-red-600 rounded-lg font-bold hover:bg-gray-100"
          >
            Retry
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-5xl font-black text-white mb-6">Select Topics</h2>
          <p className="text-2xl font-bold text-gray-300">
            Choose specific topics from {selectedSubjects.map(s => s.name).join(', ')}
          </p>
        </div>

        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="px-6 py-3 bg-blue-600 rounded-lg">
            <span className="text-white font-bold text-lg">
              {selectedTopics.length} of {topics.length} topics selected
            </span>
          </div>
          <button
            onClick={handleSelectAllTopics}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-lg"
          >
            {selectedTopics.length === topics.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        {topics.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-3xl font-black text-red-400">⚠️ No topics available</p>
            <p className="text-xl font-bold text-white mt-4">No topics found for selected subjects</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {topics.map((topic, index) => {
              const isSelected = selectedTopics.find(t => t._id === topic._id);
              return (
                <div
                  key={topic._id || index}
                  onClick={() => handleTopicToggle(topic)}
                  className={`p-6 rounded-xl border-3 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    isSelected
                      ? 'bg-blue-100 border-blue-600 text-blue-800'
                      : 'bg-white border-gray-400 text-gray-900 hover:border-blue-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">
                      {topic.name || `Topic ${index + 1}`}
                    </span>
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                      isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-500'
                    }`}>
                      {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-between max-w-6xl mx-auto pt-8">
          <button
            onClick={() => setCurrentStep(2)}
            className="flex items-center space-x-3 px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-bold text-lg"
          >
            <ChevronLeft className="w-6 h-6" />
            <span>Back</span>
          </button>
          <button
            onClick={handleTopicsNext}
            disabled={selectedTopics.length === 0}
            className="flex items-center space-x-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg"
          >
            <span>Configure Test ({selectedTopics.length} topics)</span>
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  };

  const renderTestConfiguration = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-5xl font-black text-white mb-6">Configure Your Test</h2>
        <p className="text-2xl font-bold text-gray-300">Set the number of questions and difficulty level</p>
        
        {/* Security Notice */}
        <div className="mt-6 max-w-2xl mx-auto bg-blue-900/20 border border-blue-500 rounded-xl p-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 font-bold">Secure Testing Environment</span>
          </div>
          <p className="text-blue-300 text-sm">
            Once started, this test will run in fullscreen mode. Tab switching and copying will be monitored for security.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <label className="block text-white font-black text-2xl">Number of Questions</label>
            <select
              value={testConfig.numQuestions}
              onChange={(e) => setTestConfig({...testConfig, numQuestions: parseInt(e.target.value)})}
              className="w-full p-6 bg-white border-4 border-gray-600 rounded-xl text-gray-900 font-bold text-xl focus:border-blue-600"
            >
              <option value={10}>10 Questions (Quick)</option>
              <option value={20}>20 Questions (Standard)</option>
              <option value={30}>30 Questions (Medium)</option>
              <option value={50}>50 Questions (Long)</option>
              <option value={100}>100 Questions (Full)</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="block text-white font-black text-2xl">Difficulty Level</label>
            <select
              value={testConfig.difficulty}
              onChange={(e) => setTestConfig({...testConfig, difficulty: e.target.value})}
              className="w-full p-6 bg-white border-4 border-gray-600 rounded-xl text-gray-900 font-bold text-xl focus:border-blue-600"
            >
              <option value="Easy">🟢 Easy</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Hard">🔴 Hard</option>
              <option value="Mixed">🎯 Mixed (All Levels)</option>
            </select>
          </div>
        </div>

        <div className="bg-white p-10 rounded-2xl border-4 border-gray-600 shadow-2xl">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-black text-gray-900">Test Summary</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-bold text-lg">Stream:</span>
                <span className="text-blue-600 font-black text-lg">{selectedStream?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-bold text-lg">Subjects:</span>
                <span className="text-gray-900 font-black text-lg">{selectedSubjects.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-bold text-lg">Topics:</span>
                <span className="text-gray-900 font-black text-lg">{selectedTopics.length}</span>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-bold text-lg">Questions:</span>
                <span className="text-blue-600 font-black text-lg">{testConfig.numQuestions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-bold text-lg">Difficulty:</span>
                <span className="text-gray-900 font-black text-lg">{testConfig.difficulty}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-bold text-lg">Time Limit:</span>
                <span className="text-orange-600 font-black text-lg">{Math.ceil(testConfig.numQuestions * 1.5)} minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between max-w-4xl mx-auto pt-8">
        <button
          onClick={() => setCurrentStep(3)}
          className="flex items-center space-x-3 px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-bold text-lg"
        >
          <ChevronLeft className="w-6 h-6" />
          <span>Back</span>
        </button>
        <button
          onClick={handleStartTest}
          className="flex items-center space-x-4 px-12 py-6 bg-green-600 hover:bg-green-700 text-white rounded-xl font-black text-2xl shadow-2xl transform hover:scale-105"
        >
          <Shield className="w-8 h-8" />
          <span>START SECURE TEST</span>
          <Play className="w-8 h-8" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {renderStepIndicator()}
      
      {currentStep === 1 && renderStreamSelection()}
      {currentStep === 2 && renderSubjectSelection()}
      {currentStep === 3 && renderTopicSelection()}
      {currentStep === 4 && renderTestConfiguration()}
    </div>
  );
};

// Main TestSection Component
const TestSection = () => {
  const [currentView, setCurrentView] = useState('selection');
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

  return (
    <div className="min-h-screen bg-gray-900">
      {currentView === 'selection' && (
        <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/')}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
                >
                  <Home className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-white">Test Center</h1>
                  <p className="text-gray-400 text-sm">Practice with real exam questions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={currentView === 'selection' ? 'py-8' : ''}>
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
          <div className="max-w-4xl mx-auto px-4 py-8 text-center">
            <h2 className="text-4xl font-black text-white mb-8">Test Results</h2>
            <div className="bg-white p-10 rounded-2xl border-4 border-gray-600">
              <p className="text-gray-900 font-bold mb-6 text-2xl">
                Test completed successfully! 🎉
              </p>
              <div className="bg-gray-100 p-8 rounded-xl">
                <pre className="text-gray-900 font-mono text-left text-sm overflow-auto">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
              <button
                onClick={handleBackToSelection}
                className="mt-6 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
              >
                Take Another Test
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestSection;