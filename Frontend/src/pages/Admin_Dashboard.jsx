import React, { useState, useEffect } from 'react';
import {Icon, Plus, Edit2, Trash2, Filter, Search, BookOpen, FileText, HelpCircle } from 'lucide-react';
import API_BASE_URL from '../config/api';

const AdminDashboard = () => {
  // State management
  const [activeTab, setActiveTab] = useState('streams');
  const [streams, setStreams] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: 'What is the derivative of x²?',
      streamId: 1,
      streamName: 'JEE',
      topicId: 1,
      topicName: 'Algebra',
      difficulty: 'easy',
      type: 'mcq',
      options: ['2x', 'x²', '2', 'x'],
      correctAnswer: '2x'
    },
    {
      id: 2,
      text: 'Which organ pumps blood in human body?',
      streamId: 2,
      streamName: 'NEET',
      topicId: 4,
      topicName: 'Human Anatomy',
      difficulty: 'easy',
      type: 'mcq',
      options: ['Liver', 'Heart', 'Kidney', 'Brain'],
      correctAnswer: 'Heart'
    }
  ]);

  // API helper functions
  const handleApiError = (error) => {
    console.error('API Error:', error);
    setError(error.message || 'An error occurred');
    setTimeout(() => setError(''), 5000);
  };

  // Fetch data from APIs
  const fetchStreams = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/streams`);
      if (!response.ok) throw new Error('Failed to fetch streams');
      const data = await response.json();
      setStreams(data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/topics`);
      if (!response.ok) throw new Error('Failed to fetch topics');
      const data = await response.json();
      setTopics(data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchStreams();
    fetchTopics();
  });

  // Form states
  const [streamForm, setStreamForm] = useState({ name: '', description: '' });
  const [topicForm, setTopicForm] = useState({ name: '', streamId: '' });
  const [questionForm, setQuestionForm] = useState({
    text: '',
    streamId: '',
    topicId: '',
    difficulty: 'easy',
    type: 'mcq',
    options: ['', '', '', ''],
    correctAnswer: ''
  });

  // Edit states
  const [editingStream, setEditingStream] = useState(null);
  const [editingTopic, setEditingTopic] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Filter states
  const [questionFilters, setQuestionFilters] = useState({
    streamId: '',
    topicId: '',
    difficulty: '',
    search: ''
  });

  // Stream Management Functions
  const addStream = async () => {
  // Comprehensive validation
  const validation = validateStreamForm(streamForm);
  if (!validation.isValid) {
    setError(validation.errors.join(', '));
    return;
  }

  try {
    setLoading(true);
    setError('');
    
    const response = await fetch(`${API_BASE_URL}/api/streams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: streamForm.name.trim(),
        description: streamForm.description?.trim() || ''
      }),
      // Add timeout
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed with status: ${response.status}`);
    }
    
    const newStream = await response.json();
    
    // Optimistic update with rollback capability
    // const rollback = () => {
    //   setStreams(prevStreams => prevStreams.filter(s => s.id !== newStream.id));
    // };
    
    setStreams(prevStreams => [...prevStreams, newStream]);
    setStreamForm({ name: '', description: '' });
    
    // Show success notification
    showSuccessMessage('Stream created successfully!');
    
  } catch (error) {
    if (error.name === 'TimeoutError') {
      setError('Request timed out. Please check your connection and try again.');
    } else if (error.name === 'AbortError') {
      setError('Request was cancelled.');
    } else {
      setError(error.message || 'An unexpected error occurred.');
    }
  } finally {
    setLoading(false);
  }
}


const showSuccessMessage = (message) => {
  // You could use a toast library or set a success state
  console.log(message);
  // Or if you have a success state:
  // setSuccessMessage(message);
  // setTimeout(() => setSuccessMessage(''), 3000);
};

// Helper validation function
const validateStreamForm = (form) => {
  const errors = [];
  
  if (!form.name?.trim()) {
    errors.push('Stream name is required');
  } else if (form.name.trim().length < 2) {
    errors.push('Stream name must be at least 2 characters');
  } else if (form.name.trim().length > 50) {
    errors.push('Stream name must be less than 50 characters');
  }
  
  if (form.description && form.description.length > 200) {
    errors.push('Description must be less than 200 characters');
  }
  
  // Check for duplicates
  const existingStream = streams.find(
    stream => stream.name.toLowerCase() === form.name.trim().toLowerCase()
  );
  
  if (existingStream) {
    errors.push('A stream with this name already exists');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};


  const updateStream = () => {
    setStreams(streams.map(stream => 
      stream.id === editingStream.id 
        ? { ...stream, name: streamForm.name, description: streamForm.description }
        : stream
    ));
    setEditingStream(null);
    setStreamForm({ name: '', description: '' });
  };

  const deleteStream = (id) => {
    setStreams(streams.filter(stream => stream.id !== id));
    setTopics(topics.filter(topic => topic.streamId !== id));
    setQuestions(questions.filter(question => question.streamId !== id));
  };

  const startEditStream = (stream) => {
    setEditingStream(stream);
    setStreamForm({ name: stream.name, description: stream.description });
  };

  // Topic Management Functions
  const addTopic = async () => {
    if (topicForm.name.trim() && topicForm.streamId) {
      try {
        setLoading(true);
        const selectedStream = streams.find(s => s.id === parseInt(topicForm.streamId));
        const response = await fetch(`${API_BASE_URL}/api/topics`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: topicForm.name,
            streamId: parseInt(topicForm.streamId)
          })
        });
        
        if (!response.ok) throw new Error('Failed to create topic');
        
        const newTopic = await response.json();
        // Add streamName for local state management
        const topicWithStreamName = {
          ...newTopic,
          streamName: selectedStream.name
        };
        setTopics([...topics, topicWithStreamName]);
        setTopicForm({ name: '', streamId: '' });
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const updateTopic = async () => {
    try {
      setLoading(true);
      const selectedStream = streams.find(s => s.id === parseInt(topicForm.streamId));
      const response = await fetch(`${API_BASE_URL}/api/topics/${editingTopic.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: topicForm.name,
          streamId: parseInt(topicForm.streamId)
        })
      });
      
      if (!response.ok) throw new Error('Failed to update topic');
      
      const updatedTopic = await response.json();
      const topicWithStreamName = {
        ...updatedTopic,
        streamName: selectedStream.name
      };
      setTopics(topics.map(topic => 
        topic.id === editingTopic.id ? topicWithStreamName : topic
      ));
      setEditingTopic(null);
      setTopicForm({ name: '', streamId: '' });
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTopic = async (id) => {
    if (window.confirm('Are you sure you want to delete this topic? This will also delete all associated questions.')) {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/topics/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete topic');
        
        setTopics(topics.filter(topic => topic.id !== id));
        setQuestions(questions.filter(question => question.topicId !== id));
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const startEditTopic = (topic) => {
    setEditingTopic(topic);
    setTopicForm({ name: topic.name, streamId: topic.streamId.toString() });
  };

  // Question Management Functions
  const addQuestion = () => {
    if (questionForm.text.trim() && questionForm.streamId && questionForm.topicId) {
      const selectedStream = streams.find(s => s.id === parseInt(questionForm.streamId));
      const selectedTopic = topics.find(t => t.id === parseInt(questionForm.topicId));
      
      const newQuestion = {
        id: Date.now(),
        text: questionForm.text,
        streamId: parseInt(questionForm.streamId),
        streamName: selectedStream.name,
        topicId: parseInt(questionForm.topicId),
        topicName: selectedTopic.name,
        difficulty: questionForm.difficulty,
        type: questionForm.type,
        options: questionForm.options.filter(opt => opt.trim()),
        correctAnswer: questionForm.correctAnswer
      };
      setQuestions([...questions, newQuestion]);
      setQuestionForm({
        text: '',
        streamId: '',
        topicId: '',
        difficulty: 'easy',
        type: 'mcq',
        options: ['', '', '', ''],
        correctAnswer: ''
      });
    }
  };

  const updateQuestion = () => {
    const selectedStream = streams.find(s => s.id === parseInt(questionForm.streamId));
    const selectedTopic = topics.find(t => t.id === parseInt(questionForm.topicId));
    
    setQuestions(questions.map(question => 
      question.id === editingQuestion.id 
        ? {
            ...question,
            text: questionForm.text,
            streamId: parseInt(questionForm.streamId),
            streamName: selectedStream.name,
            topicId: parseInt(questionForm.topicId),
            topicName: selectedTopic.name,
            difficulty: questionForm.difficulty,
            type: questionForm.type,
            options: questionForm.options.filter(opt => opt.trim()),
            correctAnswer: questionForm.correctAnswer
          }
        : question
    ));
    setEditingQuestion(null);
    setQuestionForm({
      text: '',
      streamId: '',
      topicId: '',
      difficulty: 'easy',
      type: 'mcq',
      options: ['', '', '', ''],
      correctAnswer: ''
    });
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter(question => question.id !== id));
  };

  const startEditQuestion = (question) => {
    setEditingQuestion(question);
    setQuestionForm({
      text: question.text,
      streamId: question.streamId.toString(),
      topicId: question.topicId.toString(),
      difficulty: question.difficulty,
      type: question.type,
      options: [...question.options, '', '', '', ''].slice(0, 4),
      correctAnswer: question.correctAnswer
    });
  };

  // Filter questions
  const filteredQuestions = questions.filter(question => {
    return (
      (!questionFilters.streamId || question.streamId === parseInt(questionFilters.streamId)) &&
      (!questionFilters.topicId || question.topicId === parseInt(questionFilters.topicId)) &&
      (!questionFilters.difficulty || question.difficulty === questionFilters.difficulty) &&
      (!questionFilters.search || question.text.toLowerCase().includes(questionFilters.search.toLowerCase()))
    );
  });

  // Get topics for selected stream
  const getTopicsForStream = (streamId) => {
    return topics.filter(topic => topic.streamId === parseInt(streamId));
  };

  const TabButton = ({ label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      icon
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage streams, topics, and questions for your examination platform</p>
          
          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          {/* Loading Indicator */}
          {loading && (
            <div className="mt-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
              Loading...
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          <TabButton
            id="streams"
            label="Streams"
            icon={BookOpen}
            isActive={activeTab === 'streams'}
            onClick={() => setActiveTab('streams')}
          />
          <TabButton
            id="topics"
            label="Topics"
            icon={FileText}
            isActive={activeTab === 'topics'}
            onClick={() => setActiveTab('topics')}
          />
          <TabButton
            id="questions"
            label="Questions"
            icon={HelpCircle}
            isActive={activeTab === 'questions'}
            onClick={() => setActiveTab('questions')}
          />
        </div>

        {/* Streams Tab */}
        {activeTab === 'streams' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-6">Stream Management</h2>
            
            {/* Add/Edit Stream Form */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium mb-4">
                {editingStream ? 'Edit Stream' : 'Add New Stream'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Stream Name (e.g., JEE, NEET)"
                  value={streamForm.name}
                  onChange={(e) => setStreamForm({...streamForm, name: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={streamForm.description}
                  onChange={(e) => setStreamForm({...streamForm, description: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={editingStream ? updateStream : addStream}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
                >
                  <Plus size={16} />
                  <span>{editingStream ? 'Update' : 'Add'} Stream</span>
                </button>
                {editingStream && (
                  <button
                    onClick={() => {
                      setEditingStream(null);
                      setStreamForm({ name: '', description: '' });
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Streams List */}
            <div className="space-y-3">
              {streams.map(stream => (
                <div key={stream.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{stream.name}</h4>
                    <p className="text-gray-600 text-sm">{stream.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {topics.filter(t => t.streamId === stream.id).length} topics
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditStream(stream)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteStream(stream.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Topics Tab */}
        {activeTab === 'topics' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-6">Topic Management</h2>
            
            {/* Add/Edit Topic Form */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium mb-4">
                {editingTopic ? 'Edit Topic' : 'Add New Topic'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <select
                  value={topicForm.streamId}
                  onChange={(e) => setTopicForm({...topicForm, streamId: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Stream</option>
                  {streams.map(stream => (
                    <option key={stream.id} value={stream.id}>{stream.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Topic Name"
                  value={topicForm.name}
                  onChange={(e) => setTopicForm({...topicForm, name: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={editingTopic ? updateTopic : addTopic}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>{editingTopic ? 'Update' : 'Add'} Topic</span>
                </button>
                {editingTopic && (
                  <button
                    onClick={() => {
                      setEditingTopic(null);
                      setTopicForm({ name: '', streamId: '' });
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Topics List */}
            <div className="space-y-3">
              {topics.map(topic => (
                <div key={topic.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{topic.name}</h4>
                    <p className="text-gray-600 text-sm">Stream: {topic.streamName}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {questions.filter(q => q.topicId === topic.id).length} questions
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditTopic(topic)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteTopic(topic.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-6">Question Management</h2>
            
            {/* Add/Edit Question Form */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium mb-4">
                {editingQuestion ? 'Edit Question' : 'Add New Question'}
              </h3>
              
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <select
                  value={questionForm.streamId}
                  onChange={(e) => setQuestionForm({...questionForm, streamId: e.target.value, topicId: ''})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Stream</option>
                  {streams.map(stream => (
                    <option key={stream.id} value={stream.id}>{stream.name}</option>
                  ))}
                </select>
                
                <select
                  value={questionForm.topicId}
                  onChange={(e) => setQuestionForm({...questionForm, topicId: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!questionForm.streamId}
                >
                  <option value="">Select Topic</option>
                  {getTopicsForStream(questionForm.streamId).map(topic => (
                    <option key={topic.id} value={topic.id}>{topic.name}</option>
                  ))}
                </select>
                
                <select
                  value={questionForm.difficulty}
                  onChange={(e) => setQuestionForm({...questionForm, difficulty: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              
              {/* Question Text */}
              <textarea
                placeholder="Enter question text"
                value={questionForm.text}
                onChange={(e) => setQuestionForm({...questionForm, text: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                rows="3"
              />
              
              {/* Question Type */}
              <div className="mb-4">
                <select
                  value={questionForm.type}
                  onChange={(e) => setQuestionForm({...questionForm, type: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="mcq">Multiple Choice (MCQ)</option>
                  <option value="integer">Integer Answer</option>
                  <option value="boolean">True/False</option>
                </select>
              </div>
              
              {/* Options (for MCQ) */}
              {questionForm.type === 'mcq' && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Options:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    {questionForm.options.map((option, index) => (
                      <input
                        key={index}
                        type="text"
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...questionForm.options];
                          newOptions[index] = e.target.value;
                          setQuestionForm({...questionForm, options: newOptions});
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Correct Answer"
                    value={questionForm.correctAnswer}
                    onChange={(e) => setQuestionForm({...questionForm, correctAnswer: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
                  />
                </div>
              )}
              
              <div className="flex space-x-3">
                <button
                  onClick={editingQuestion ? updateQuestion : addQuestion}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>{editingQuestion ? 'Update' : 'Add'} Question</span>
                </button>
                {editingQuestion && (
                  <button
                    onClick={() => {
                      setEditingQuestion(null);
                      setQuestionForm({
                        text: '',
                        streamId: '',
                        topicId: '',
                        difficulty: 'easy',
                        type: 'mcq',
                        options: ['', '', '', ''],
                        correctAnswer: ''
                      });
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Filter size={20} />
                <h3 className="text-lg font-medium">Filters</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  value={questionFilters.streamId}
                  onChange={(e) => setQuestionFilters({...questionFilters, streamId: e.target.value, topicId: ''})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Streams</option>
                  {streams.map(stream => (
                    <option key={stream.id} value={stream.id}>{stream.name}</option>
                  ))}
                </select>
                
                <select
                  value={questionFilters.topicId}
                  onChange={(e) => setQuestionFilters({...questionFilters, topicId: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!questionFilters.streamId}
                >
                  <option value="">All Topics</option>
                  {getTopicsForStream(questionFilters.streamId).map(topic => (
                    <option key={topic.id} value={topic.id}>{topic.name}</option>
                  ))}
                </select>
                
                <select
                  value={questionFilters.difficulty}
                  onChange={(e) => setQuestionFilters({...questionFilters, difficulty: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={questionFilters.search}
                    onChange={(e) => setQuestionFilters({...questionFilters, search: e.target.value})}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                  />
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {filteredQuestions.map(question => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-2">{question.text}</p>
                      <div className="flex flex-wrap gap-2 text-sm">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {question.streamName}
                        </span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                          {question.topicName}
                        </span>
                        <span className={`px-2 py-1 rounded capitalize ${
                          question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                          question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {question.difficulty}
                        </span>
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded uppercase">
                          {question.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => startEditQuestion(question)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteQuestion(question.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {question.type === 'mcq' && question.options.length > 0 && (
                    <div className="mt-3 p-3 bg-gray-50 rounded">
                      <h5 className="font-medium mb-2">Options:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm">
                        {question.options.map((option, index) => (
                          <div 
                            key={index} 
                            className={`p-2 rounded ${
                              option === question.correctAnswer 
                                ? 'bg-green-100 text-green-800 font-medium' 
                                : 'bg-white'
                            }`}
                          >
                            {String.fromCharCode(65 + index)}. {option}
                            {option === question.correctAnswer && ' ✓'}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {filteredQuestions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No questions found matching your filters
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;