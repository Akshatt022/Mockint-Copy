import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Target, TrendingUp, Trophy, BookOpen, 
  ChevronLeft, ChevronRight, BarChart3, Filter, Download,
  CheckCircle, XCircle, Eye, Loader, AlertCircle, RefreshCw
} from 'lucide-react';
import API_BASE_URL from '../config/api';

const TestHistory = ({ onViewResult, onRetakeTest }) => {
  const [testHistory, setTestHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all'); // all, recent, high-score, low-score
  const [sortBy, setSortBy] = useState('recent'); // recent, score, duration

  useEffect(() => {
    fetchTestHistory();
  }, [currentPage, filter, sortBy]);

  const fetchTestHistory = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/tests/history?page=${currentPage}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch test history: ${response.status}`);
      }

      const data = await response.json();
      setTestHistory(data.testResults || []);
      setTotalPages(data.pagination?.pages || 1);

    } catch (err) {
      console.error('Error fetching test history:', err);
      setError(err.message || 'Failed to load test history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'D';
  };

  const calculateAverageScore = () => {
    if (testHistory.length === 0) return 0;
    const total = testHistory.reduce((sum, test) => sum + test.percentage, 0);
    return (total / testHistory.length).toFixed(1);
  };

  const getBestScore = () => {
    if (testHistory.length === 0) return 0;
    return Math.max(...testHistory.map(test => test.percentage)).toFixed(1);
  };

  const getTotalTestsTaken = () => testHistory.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-20 h-20 text-blue-400 animate-spin mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Loading Test History
          </h2>
          <p className="text-gray-100 text-lg">Please wait while we fetch your results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-20 h-20 text-red-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
            Error Loading History
          </h2>
          <p className="text-gray-100 mb-8 text-lg">{error}</p>
          <button
            onClick={fetchTestHistory}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all duration-200 transform hover:scale-105"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800/95 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Test History
              </h1>
              <p className="text-gray-100 text-lg">Review your past performance and track progress</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchTestHistory}
                className="flex items-center space-x-3 px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 hover:border-blue-500/50 text-blue-400 rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Statistics Overview */}
        {testHistory.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 rounded-2xl"></div>
              <div className="relative bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-100 text-sm font-medium mb-2">Tests Taken</p>
                    <p className="text-3xl font-black text-white">{getTotalTestsTaken()}</p>
                  </div>
                  <div className="w-14 h-14 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                    <Target className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-emerald-600/10 rounded-2xl"></div>
              <div className="relative bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-100 text-sm font-medium mb-2">Average Score</p>
                    <p className="text-3xl font-black text-white">{calculateAverageScore()}%</p>
                  </div>
                  <div className="w-14 h-14 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-green-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/10 to-amber-600/10 rounded-2xl"></div>
              <div className="relative bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-100 text-sm font-medium mb-2">Best Score</p>
                    <p className="text-3xl font-black text-white">{getBestScore()}%</p>
                  </div>
                  <div className="w-14 h-14 bg-yellow-500/20 border border-yellow-500/30 rounded-xl flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-2xl"></div>
              <div className="relative bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-100 text-sm font-medium mb-2">Current Grade</p>
                    <p className="text-3xl font-black text-white">{getPerformanceGrade(calculateAverageScore())}</p>
                  </div>
                  <div className="w-14 h-14 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-purple-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Controls */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-6 md:space-y-0">
            <div className="flex items-center space-x-6">
              <div>
                <label className="block text-sm font-bold text-gray-100 mb-3">Filter</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                >
                  <option value="all">All Tests</option>
                  <option value="recent">Last 7 Days</option>
                  <option value="high-score">High Scores (≥80%)</option>
                  <option value="low-score">Needs Review (≤60%)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-100 mb-3">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                >
                  <option value="recent">Most Recent</option>
                  <option value="score">Highest Score</option>
                  <option value="duration">Shortest Time</option>
                </select>
              </div>
            </div>

            <div className="text-gray-100 font-medium">
              Showing {testHistory.length} results
            </div>
          </div>
        </div>

        {/* Test History List */}
        {testHistory.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl p-16 border border-gray-700/50 text-center">
            <BookOpen className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">No Test History</h3>
            <p className="text-gray-100 mb-8 text-lg">You haven't taken any tests yet. Start practicing to see your results here!</p>
            <button
              onClick={() => window.history.back()}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all duration-200 transform hover:scale-105"
            >
              Take Your First Test
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {testHistory.map((test) => (
              <div key={test._id} className="relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-2xl"></div>
                <div className="relative bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 transform hover:scale-[1.02]">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-6 mb-6">
                      <div className="flex items-center space-x-3">
                        <BookOpen className="w-6 h-6 text-blue-400" />
                        <span className="font-black text-xl text-white">{test.stream?.name || 'Unknown Stream'}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-100 font-medium">{formatDate(test.createdAt)}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-100 font-medium">{formatDuration(test.timeTaken)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="bg-gray-700/30 rounded-xl p-4">
                        <p className="text-gray-300 text-sm font-medium mb-1">Score</p>
                        <p className={`font-black text-2xl ${
                          test.percentage >= 80 ? 'text-green-400' :
                          test.percentage >= 60 ? 'text-blue-400' :
                          test.percentage >= 40 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {test.percentage.toFixed(1)}%
                        </p>
                      </div>

                      <div className="bg-gray-700/30 rounded-xl p-4">
                        <p className="text-gray-300 text-sm font-medium mb-1">Correct</p>
                        <p className="font-black text-2xl text-green-400">
                          {test.correctAnswers}/{test.totalQuestions}
                        </p>
                      </div>

                      <div className="bg-gray-700/30 rounded-xl p-4">
                        <p className="text-gray-300 text-sm font-medium mb-1">Difficulty</p>
                        <p className="font-black text-2xl text-white">{test.difficulty}</p>
                      </div>

                      <div className="bg-gray-700/30 rounded-xl p-4">
                        <p className="text-gray-300 text-sm font-medium mb-1">Grade</p>
                        <p className="font-black text-2xl text-white">
                          {getPerformanceGrade(test.percentage)}
                        </p>
                      </div>
                    </div>

                    {test.subjects && test.subjects.length > 0 && (
                      <div className="mt-6">
                        <p className="text-gray-300 font-medium mb-3">Subjects:</p>
                        <div className="flex flex-wrap gap-3">
                          {test.subjects.map((subject, index) => (
                            <span
                              key={index}
                              className="px-4 py-2 bg-blue-500/20 text-blue-400 text-sm font-bold rounded-xl border border-blue-500/30"
                            >
                              {subject.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-4 ml-8">
                    <button
                      onClick={() => onViewResult(test._id)}
                      className="flex items-center space-x-3 px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 hover:border-blue-500/50 text-blue-400 rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
                    >
                      <Eye className="w-5 h-5" />
                      <span>View Details</span>
                    </button>
                    
                    <button
                      onClick={() => onRetakeTest(test)}
                      className="flex items-center space-x-3 px-6 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 hover:border-green-500/50 text-green-400 rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
                    >
                      <RefreshCw className="w-5 h-5" />
                      <span>Retake</span>
                    </button>
                  </div>
                </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-6 mt-10">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center space-x-3 px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            <div className="flex space-x-3">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-3 rounded-xl font-bold transition-all duration-200 ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white shadow-lg transform scale-110'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center space-x-3 px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              <span>Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestHistory;