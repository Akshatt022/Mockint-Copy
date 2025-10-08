import React, { useState } from 'react';
import { 
  Trophy, Star, Clock, Target, BookOpen, CheckCircle, XCircle, 
  Flag, ArrowLeft, ArrowRight, Home, RefreshCw, Download, 
  Eye, EyeOff, BarChart3, PieChart, TrendingUp, Award,
  Calendar, User, Zap, Shield, AlertTriangle, Sparkles,
  Medal, Crown, Flame, Activity, TrendingDown, Brain,
  Coffee, Lightbulb, Rocket, Plus, ChevronLeft, ChevronRight
} from 'lucide-react';

const TestResults = ({ testResult, onBackToSelection, onRetakeTest }) => {
  const [currentReviewQuestion, setCurrentReviewQuestion] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const [activeTab, setActiveTab] = useState('summary'); // summary, review, analysis

  if (!testResult || !testResult.summary || !testResult.questions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <AlertTriangle className="w-20 h-20 mx-auto mb-6 text-red-400" />
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
            Invalid Test Results
          </h2>
          <p className="text-gray-100 mb-8 text-lg">Unable to display test results. Data may be corrupted.</p>
          <button
            onClick={onBackToSelection}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all duration-200 transform hover:scale-105"
          >
            Back to Test Selection
          </button>
        </div>
      </div>
    );
  }

  const { summary, questions } = testResult;
  const { 
    totalQuestions, 
    correctAnswers, 
    wrongAnswers, 
    skippedQuestions, 
    percentage, 
    score, 
    timeTaken 
  } = summary;

  // Calculate performance metrics
  const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions * 100).toFixed(1) : 0;
  const attemptedQuestions = totalQuestions - skippedQuestions;
  const attemptAccuracy = attemptedQuestions > 0 ? (correctAnswers / attemptedQuestions * 100).toFixed(1) : 0;
  
  // Performance grade with enhanced styling
  const getGrade = (percent) => {
    if (percent >= 90) return { 
      grade: 'A+', 
      color: 'text-green-400', 
      bg: 'bg-green-500/20', 
      border: 'border-green-500/30',
      glow: 'shadow-green-500/25'
    };
    if (percent >= 80) return { 
      grade: 'A', 
      color: 'text-green-400', 
      bg: 'bg-green-500/20', 
      border: 'border-green-500/30',
      glow: 'shadow-green-500/25'
    };
    if (percent >= 70) return { 
      grade: 'B+', 
      color: 'text-blue-400', 
      bg: 'bg-blue-500/20', 
      border: 'border-blue-500/30',
      glow: 'shadow-blue-500/25'
    };
    if (percent >= 60) return { 
      grade: 'B', 
      color: 'text-blue-400', 
      bg: 'bg-blue-500/20', 
      border: 'border-blue-500/30',
      glow: 'shadow-blue-500/25'
    };
    if (percent >= 50) return { 
      grade: 'C', 
      color: 'text-yellow-400', 
      bg: 'bg-yellow-500/20', 
      border: 'border-yellow-500/30',
      glow: 'shadow-yellow-500/25'
    };
    return { 
      grade: 'D', 
      color: 'text-red-400', 
      bg: 'bg-red-500/20', 
      border: 'border-red-500/30',
      glow: 'shadow-red-500/25'
    };
  };

  const performanceGrade = getGrade(percentage);

  // Question analysis
  const getQuestionsByDifficulty = () => {
    const analysis = { Easy: { correct: 0, total: 0 }, Medium: { correct: 0, total: 0 }, Hard: { correct: 0, total: 0 } };
    
    questions.forEach(q => {
      const difficulty = q.difficulty || 'Medium';
      analysis[difficulty].total++;
      if (q.isCorrect) {
        analysis[difficulty].correct++;
      }
    });
    
    return analysis;
  };

  const difficultyAnalysis = getQuestionsByDifficulty();

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const renderSummaryTab = () => (
    <div className="space-y-10">
      {/* Hero Performance Card */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl"></div>
        <div className="relative bg-gray-800/50 backdrop-blur-xl rounded-3xl p-10 border border-gray-700/50">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Test Complete!
              </h2>
              <p className="text-gray-100 text-lg">Here's how you performed</p>
            </div>
            <div className={`px-8 py-4 rounded-2xl ${performanceGrade.bg} ${performanceGrade.border} border-2 shadow-xl ${performanceGrade.glow}`}>
              <div className="flex items-center space-x-3">
                <Trophy className={`w-8 h-8 ${performanceGrade.color}`} />
                <span className={`font-black text-3xl ${performanceGrade.color}`}>
                  {performanceGrade.grade}
                </span>
              </div>
            </div>
          </div>

          {/* Score Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Score Circle */}
            <div className="text-center">
              <div className="relative w-40 h-40 mx-auto mb-6">
                <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="rgb(55 65 81)"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${percentage * 4.4} ${(100 - percentage) * 4.4}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-4xl font-black text-white">{percentage.toFixed(1)}%</p>
                    <p className="text-gray-200 font-medium">Overall Score</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-white">{score} Points</p>
                <p className="text-gray-200">Total Score Achieved</p>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <p className="text-2xl font-bold text-green-400">{correctAnswers}</p>
                <p className="text-green-300 text-sm font-medium">Correct</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
                <XCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
                <p className="text-2xl font-bold text-red-400">{wrongAnswers}</p>
                <p className="text-red-300 text-sm font-medium">Wrong</p>
              </div>
              <div className="bg-gray-500/10 border border-gray-500/20 rounded-2xl p-6 text-center">
                <Clock className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="text-2xl font-bold text-gray-400">{skippedQuestions}</p>
                <p className="text-gray-100 text-sm font-medium">Skipped</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 text-center">
                <Target className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <p className="text-2xl font-bold text-blue-400">{totalQuestions}</p>
                <p className="text-blue-300 text-sm font-medium">Total</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-700/30 rounded-xl">
                <span className="text-gray-100 font-medium">Accuracy:</span>
                <span className="font-bold text-white">{accuracy}%</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-700/30 rounded-xl">
                <span className="text-gray-100 font-medium">Time Taken:</span>
                <span className="font-bold text-white">{formatTime(timeTaken)}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-700/30 rounded-xl">
                <span className="text-gray-100 font-medium">Attempt Rate:</span>
                <span className="font-bold text-white">{((attemptedQuestions/totalQuestions)*100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-700/30 rounded-xl">
                <span className="text-gray-100 font-medium">Attempt Accuracy:</span>
                <span className="font-bold text-white">{attemptAccuracy}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Analysis */}
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50">
        <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
          <BarChart3 className="w-6 h-6 mr-3 text-blue-400" />
          Performance by Difficulty
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(difficultyAnalysis).map(([difficulty, data]) => {
            const difficultyPercentage = data.total > 0 ? (data.correct / data.total * 100) : 0;
            const getDifficultyTheme = (diff) => {
              switch(diff) {
                case 'Easy': return { 
                  bg: 'bg-green-500/10', 
                  border: 'border-green-500/20', 
                  text: 'text-green-400',
                  accent: 'text-green-300',
                  progressBg: 'bg-green-500'
                };
                case 'Medium': return { 
                  bg: 'bg-yellow-500/10', 
                  border: 'border-yellow-500/20', 
                  text: 'text-yellow-400',
                  accent: 'text-yellow-300',
                  progressBg: 'bg-yellow-500'
                };
                case 'Hard': return { 
                  bg: 'bg-red-500/10', 
                  border: 'border-red-500/20', 
                  text: 'text-red-400',
                  accent: 'text-red-300',
                  progressBg: 'bg-red-500'
                };
                default: return { 
                  bg: 'bg-gray-500/10', 
                  border: 'border-gray-500/20', 
                  text: 'text-gray-400',
                  accent: 'text-gray-300',
                  progressBg: 'bg-gray-500'
                };
              }
            };
            
            const theme = getDifficultyTheme(difficulty);
            
            return (
              <div key={difficulty} className={`${theme.bg} ${theme.border} border-2 rounded-2xl p-8`}>
                <div className="text-center">
                  <h4 className={`text-xl font-bold ${theme.text} mb-4`}>{difficulty}</h4>
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="rgb(55 65 81)"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke={theme.text.replace('text-', '')}
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${difficultyPercentage * 2.51} ${(100 - difficultyPercentage) * 2.51}`}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-xl font-bold ${theme.text}`}>
                        {data.total > 0 ? difficultyPercentage.toFixed(0) : 0}%
                      </span>
                    </div>
                  </div>
                  <p className={`${theme.accent} font-medium`}>
                    {data.correct}/{data.total} correct
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => setActiveTab('review')}
          className="group bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 rounded-2xl p-8 transition-all duration-300 transform hover:scale-105"
        >
          <Eye className="w-10 h-10 text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
          <h3 className="text-xl font-bold text-blue-400 mb-2">Review Answers</h3>
          <p className="text-blue-300">See correct solutions and explanations</p>
        </button>

        <button
          onClick={onRetakeTest}
          className="group bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 hover:border-green-500/40 rounded-2xl p-8 transition-all duration-300 transform hover:scale-105"
        >
          <RefreshCw className="w-10 h-10 text-green-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
          <h3 className="text-xl font-bold text-green-400 mb-2">Retake Test</h3>
          <p className="text-green-300">Try again to improve your score</p>
        </button>

        <button
          onClick={() => setActiveTab('analysis')}
          className="group bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 hover:border-purple-500/40 rounded-2xl p-8 transition-all duration-300 transform hover:scale-105"
        >
          <TrendingUp className="w-10 h-10 text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
          <h3 className="text-xl font-bold text-purple-400 mb-2">Detailed Analysis</h3>
          <p className="text-purple-300">Study performance trends</p>
        </button>
      </div>
    </div>
  );

  const renderReviewTab = () => {
    const currentQuestion = questions[currentReviewQuestion];
    
    if (!currentQuestion) {
      return (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-200 text-lg">No questions available for review.</p>
        </div>
      );
    }

    const userAnswer = currentQuestion.selectedAnswer;
    const correctAnswer = currentQuestion.correctAnswer;
    const isCorrect = currentQuestion.isCorrect;

    return (
      <div className="space-y-8">
        {/* Review Header */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Question {currentReviewQuestion + 1} of {questions.length}
              </h3>
              <div className="flex items-center space-x-4">
                <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${
                  currentQuestion.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                  currentQuestion.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                  'bg-red-500/20 text-red-400 border-red-500/30'
                }`}>
                  {currentQuestion.difficulty}
                </span>
                <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${
                  isCorrect ? 'bg-green-500/20 text-green-400 border-green-500/30' : 
                  userAnswer === -1 ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' :
                  'bg-red-500/20 text-red-400 border-red-500/30'
                }`}>
                  {isCorrect ? '✓ Correct' : userAnswer === -1 ? '○ Skipped' : '✗ Incorrect'}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => setShowAnswers(!showAnswers)}
              className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-bold transition-all duration-200 ${
                showAnswers 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' 
                  : 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
              }`}
            >
              {showAnswers ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              <span>{showAnswers ? 'Hide' : 'Show'} Answers</span>
            </button>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentReviewQuestion(Math.max(0, currentReviewQuestion - 1))}
              disabled={currentReviewQuestion === 0}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            <div className="flex space-x-2">
              {questions.slice(0, 10).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentReviewQuestion(index)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-200 ${
                    index === currentReviewQuestion
                      ? 'bg-blue-600 text-white shadow-lg'
                      : questions[index].isCorrect
                      ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30'
                      : questions[index].selectedAnswer === -1
                      ? 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 border border-gray-500/30'
                      : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              {questions.length > 10 && (
                <span className="px-3 py-2 text-gray-500 font-bold">...</span>
              )}
            </div>

            <button
              onClick={() => setCurrentReviewQuestion(Math.min(questions.length - 1, currentReviewQuestion + 1))}
              disabled={currentReviewQuestion === questions.length - 1}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <span>Next</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Question Content */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
        <h4 className="text-xl font-bold text-white mb-8 leading-relaxed whitespace-pre-wrap">
          {currentQuestion.questionText}
        </h4>

          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => {
              const isUserAnswer = userAnswer === index;
              const isCorrectOption = correctAnswer === index;
              const showCorrect = showAnswers && isCorrectOption;
              const showWrong = showAnswers && isUserAnswer && !isCorrect;

              return (
                <div
                  key={index}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                    showCorrect
                      ? 'border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20'
                      : showWrong
                      ? 'border-red-500 bg-red-500/10 shadow-lg shadow-red-500/20'
                      : isUserAnswer
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-600 bg-gray-700/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        showCorrect
                          ? 'border-green-500 bg-green-500'
                          : showWrong
                          ? 'border-red-500 bg-red-500'
                          : isUserAnswer
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-500'
                      }`}>
                        {showCorrect ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : showWrong ? (
                          <XCircle className="w-5 h-5 text-white" />
                        ) : (isUserAnswer && !showWrong) ? (
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        ) : null}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`font-bold text-lg ${
                          showCorrect ? 'text-green-400' :
                          showWrong ? 'text-red-400' :
                          isUserAnswer ? 'text-blue-400' : 'text-gray-400'
                        }`}>
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <span className="font-medium text-white text-lg">
                          {option.text}
                        </span>
                      </div>
                    </div>
                    
                    {showAnswers && (
                      <div className="flex items-center space-x-2">
                        {isCorrectOption && (
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30">
                            Correct Answer
                          </span>
                        )}
                        {isUserAnswer && !isCorrectOption && (
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full border border-blue-500/30">
                            Your Answer
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Explanation */}
          {showAnswers && currentQuestion.explanation && (
            <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <div className="flex items-start space-x-3">
                <Lightbulb className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h5 className="font-bold text-blue-400 mb-2">Explanation:</h5>
                  <p className="text-blue-300 leading-relaxed">{currentQuestion.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAnalysisTab = () => (
    <div className="space-y-8">
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
        <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
          <TrendingUp className="w-6 h-6 mr-3 text-purple-400" />
          Performance Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Trophy className="w-8 h-8 text-green-400" />
              <h4 className="font-bold text-green-400 text-lg">Strengths</h4>
            </div>
            <ul className="space-y-3">
              {correctAnswers > totalQuestions * 0.7 && (
                <li className="flex items-center space-x-3 text-green-300">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Strong overall performance</span>
                </li>
              )}
              {difficultyAnalysis.Easy.total > 0 && difficultyAnalysis.Easy.correct / difficultyAnalysis.Easy.total > 0.8 && (
                <li className="flex items-center space-x-3 text-green-300">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Excellent on easy questions</span>
                </li>
              )}
              {attemptedQuestions / totalQuestions > 0.9 && (
                <li className="flex items-center space-x-3 text-green-300">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Good attempt rate</span>
                </li>
              )}
              {timeTaken < (totalQuestions * 1.2) && (
                <li className="flex items-center space-x-3 text-green-300">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Efficient time management</span>
                </li>
              )}
            </ul>
          </div>
          
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingDown className="w-8 h-8 text-red-400" />
              <h4 className="font-bold text-red-400 text-lg">Areas for Improvement</h4>
            </div>
            <ul className="space-y-3">
              {wrongAnswers > correctAnswers && (
                <li className="flex items-center space-x-3 text-red-300">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Focus on accuracy</span>
                </li>
              )}
              {skippedQuestions > totalQuestions * 0.2 && (
                <li className="flex items-center space-x-3 text-red-300">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Work on time management</span>
                </li>
              )}
              {difficultyAnalysis.Hard.total > 0 && difficultyAnalysis.Hard.correct / difficultyAnalysis.Hard.total < 0.5 && (
                <li className="flex items-center space-x-3 text-red-300">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Practice harder questions</span>
                </li>
              )}
              {percentage < 60 && (
                <li className="flex items-center space-x-3 text-red-300">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Review fundamental concepts</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="w-8 h-8 text-blue-400" />
            <h4 className="font-bold text-blue-400 text-lg">AI Insights</h4>
          </div>
          <div className="space-y-3">
            <p className="text-blue-300">
              Based on your performance, you're at a <span className="font-bold text-blue-400">{performanceGrade.grade}</span> level.
            </p>
            {percentage >= 80 ? (
              <p className="text-blue-300">
                Excellent work! You're ready for advanced topics and can focus on speed optimization.
              </p>
            ) : percentage >= 60 ? (
              <p className="text-blue-300">
                Good foundation! Focus on practicing more difficult questions to reach the next level.
              </p>
            ) : (
              <p className="text-blue-300">
                Keep practicing! Focus on understanding basic concepts before moving to advanced topics.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800/95 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBackToSelection}
                className="p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl transition-all duration-200"
              >
                <Home className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Test Results
                </h1>
                <p className="text-gray-200 text-sm">Review your performance and learn from mistakes</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${performanceGrade.bg} ${performanceGrade.border} border`}>
                <Trophy className={`w-5 h-5 ${performanceGrade.color}`} />
                <span className={`font-bold ${performanceGrade.color}`}>{percentage.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-800/50 border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'summary', label: 'Summary', icon: BarChart3 },
              { id: 'review', label: 'Review Answers', icon: Eye },
              { id: 'analysis', label: 'Analysis', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 border-b-2 font-bold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-200 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {activeTab === 'summary' && renderSummaryTab()}
        {activeTab === 'review' && renderReviewTab()}
        {activeTab === 'analysis' && renderAnalysisTab()}
      </div>
    </div>
  );
};

export default TestResults;
