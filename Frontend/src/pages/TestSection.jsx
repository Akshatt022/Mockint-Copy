import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Target, TrendingUp, Star, ArrowRight, Users, Award } from 'lucide-react';

const TestCard = ({ title, description, duration, questions, difficulty, category, popularity }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const difficultyColors = {
    Easy: 'bg-green-100 text-green-800 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Hard: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <div 
      className={`bg-white rounded-2xl border border-gray-100 p-6 transition-all duration-300 hover:shadow-2xl hover:border-blue-200 hover:-translate-y-2 cursor-pointer group ${isHovered ? 'shadow-2xl border-blue-200 -translate-y-2' : 'shadow-lg'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {description}
          </p>
        </div>
        <div className="ml-4 flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < popularity ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
            />
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
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
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
          <Target className="w-3 h-3 mr-1" />
          {category}
        </span>
      </div>

      {/* Action Button */}
      <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg group flex items-center justify-center space-x-2">
        <span>Start Test</span>
        <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
      </button>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="ml-4 flex space-x-1">
            {[...Array(5)].map((_, j) => (
              <div key={j} className="w-4 h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
        <div className="h-12 bg-gray-200 rounded-xl"></div>
      </div>
    ))}
  </div>
);

const TestsSection = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [streams, setStreams] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  const mockStreams = [
    {
      _id: '1',
      name: 'JEE Main Mock Test',
      description: 'Comprehensive test covering Physics, Chemistry, and Mathematics',
      duration: '3 hours',
      questions: 90,
      difficulty: 'Hard',
      category: 'Engineering',
      popularity: 5
    },
    {
      _id: '2',
      name: 'NEET Biology Practice',
      description: 'Focus on Botany and Zoology concepts for medical entrance',
      duration: '2 hours',
      questions: 180,
      difficulty: 'Medium',
      category: 'Medical',
      popularity: 4
    },
    {
      _id: '3',
      name: 'CAT Quantitative Aptitude',
      description: 'Mathematical reasoning and problem-solving skills',
      duration: '1.5 hours',
      questions: 34,
      difficulty: 'Hard',
      category: 'Management',
      popularity: 4
    },
    {
      _id: '4',
      name: 'GATE Computer Science',
      description: 'Data structures, algorithms, and computer systems',
      duration: '3 hours',
      questions: 65,
      difficulty: 'Hard',
      category: 'Engineering',
      popularity: 5
    },
    {
      _id: '5',
      name: 'UPSC Prelims GS',
      description: 'General Studies for civil services preliminary exam',
      duration: '2 hours',
      questions: 100,
      difficulty: 'Medium',
      category: 'Civil Services',
      popularity: 5
    },
    {
      _id: '6',
      name: 'Bank PO Reasoning',
      description: 'Logical reasoning and analytical ability test',
      duration: '1 hour',
      questions: 35,
      difficulty: 'Easy',
      category: 'Banking',
      popularity: 3
    }
  ];

  const categories = ['All', 'Engineering', 'Medical', 'Management', 'Civil Services', 'Banking'];

  useEffect(() => {
    // Simulate API call
    const loadTests = async () => {
      setLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
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
    const matchesSearch = stream.name.toLowerCase().includes(searchTerm.toLowerCase()) || stream.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Mock Tests for
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> All Major Exams</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Practice with our comprehensive collection of mock tests designed to simulate real exam conditions
            and boost your confidence
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
              />
              <BookOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">150+</p>
                <p className="text-gray-600 text-sm">Mock Tests</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">50k+</p>
                <p className="text-gray-600 text-sm">Students</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">95%</p>
                <p className="text-gray-600 text-sm">Accuracy</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">85%</p>
                <p className="text-gray-600 text-sm">Success Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading && <LoadingSkeleton />}
        
        {error && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <Target className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-red-600 text-lg font-medium mb-4">Error loading tests</p>
            <p className="text-gray-600 mb-6">{error}</p>
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
            {/* Results Info */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredStreams.length}</span> tests
                {selectedCategory !== 'All' && (
                  <span> in <span className="font-semibold text-blue-600">{selectedCategory}</span></span>
                )}
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Updated 2 hours ago</span>
              </div>
            </div>

            {/* Tests Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredStreams.map((stream) => (
                <TestCard
                  key={stream._id}
                  title={stream.name}
                  description={stream.description}
                  duration={stream.duration}
                  questions={stream.questions}
                  difficulty={stream.difficulty}
                  category={stream.category}
                  popularity={stream.popularity}
                />
              ))}
            </div>

            {filteredStreams.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 text-lg">No tests found matching your criteria</p>
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

export default TestsSection;