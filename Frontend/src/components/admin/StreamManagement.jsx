import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ChevronRight, BookOpen, FileText, HelpCircle } from 'lucide-react';

const StreamManagement = ({ getAuthHeaders, API_BASE }) => {
  const [streams, setStreams] = useState([]);
  const [selectedStream, setSelectedStream] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  
  const [setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'stream', 'subject', 'topic', 'question'
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({});

  // Fetch streams
  const fetchStreams = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/admin/streams`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        setStreams(data.streams);
      }
    } catch (error) {
      console.error('Error fetching streams:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subjects for selected stream
  const fetchSubjects = async (streamId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/admin/subjects/stream/${streamId}`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubjects(data.subjects);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch topics for selected subject
  const fetchTopics = async (subjectId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/admin/topics/subject/${subjectId}`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        setTopics(data.topics);
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch questions for selected topic
  const fetchQuestions = async (topicId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/admin/questions/topic/${topicId}`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStreams();
  }, []);

  const handleStreamSelect = (stream) => {
    setSelectedStream(stream);
    setSelectedSubject(null);
    setSelectedTopic(null);
    setSubjects([]);
    setTopics([]);
    setQuestions([]);
    fetchSubjects(stream._id);
  };

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setSelectedTopic(null);
    setTopics([]);
    setQuestions([]);
    fetchTopics(subject._id);
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setQuestions([]);
    fetchQuestions(topic._id);
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditItem(item);
    setShowModal(true);
    
    // Pre-fill form for editing
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        isActive: item.isActive !== undefined ? item.isActive : true,
        text: item.text || '',
        options: item.options || ['', '', '', ''],
        correctOption: item.correctOption || 0,
        explanation: item.explanation || '',
        difficulty: item.difficulty || 'medium'
      });
    } else {
      // Clear form for new item
      setFormData({
        name: '',
        description: '',
        isActive: true,
        text: '',
        options: ['', '', '', ''],
        correctOption: 0,
        explanation: '',
        difficulty: 'medium'
      });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditItem(null);
    setFormData({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let url = `${API_BASE}/admin/`;
    let method = editItem ? 'PUT' : 'POST';
    let body = { ...formData };

    // Build URL and add parent IDs based on type
    switch (modalType) {
      case 'stream':
        url += editItem ? `streams/${editItem._id}` : 'streams';
        break;
      case 'subject':
        url += editItem ? `subjects/${editItem._id}` : 'subjects';
        if (!editItem) body.stream = selectedStream._id;
        break;
      case 'topic':
        url += editItem ? `topics/${editItem._id}` : 'topics';
        if (!editItem) body.subject = selectedSubject._id;
        break;
      case 'question':
        url += editItem ? `questions/${editItem._id}` : 'questions';
        if (!editItem) body.topic = selectedTopic._id;
        break;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        closeModal();
        // Refresh the appropriate list
        switch (modalType) {
          case 'stream':
            fetchStreams();
            break;
          case 'subject':
            fetchSubjects(selectedStream._id);
            break;
          case 'topic':
            fetchTopics(selectedSubject._id);
            break;
          case 'question':
            fetchQuestions(selectedTopic._id);
            break;
        }
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save');
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    let url = `${API_BASE}/admin/`;
    switch (type) {
      case 'stream':
        url += `streams/${id}`;
        break;
      case 'subject':
        url += `subjects/${id}`;
        break;
      case 'topic':
        url += `topics/${id}`;
        break;
      case 'question':
        url += `questions/${id}`;
        break;
    }

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        // Refresh the appropriate list
        switch (type) {
          case 'stream':
            fetchStreams();
            if (selectedStream?._id === id) {
              setSelectedStream(null);
              setSubjects([]);
            }
            break;
          case 'subject':
            fetchSubjects(selectedStream._id);
            if (selectedSubject?._id === id) {
              setSelectedSubject(null);
              setTopics([]);
            }
            break;
          case 'topic':
            fetchTopics(selectedSubject._id);
            if (selectedTopic?._id === id) {
              setSelectedTopic(null);
              setQuestions([]);
            }
            break;
          case 'question':
            fetchQuestions(selectedTopic._id);
            break;
        }
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="font-medium">Content Hierarchy:</span>
        <span>Stream</span>
        {selectedStream && (
          <>
            <ChevronRight className="w-4 h-4" />
            <span>{selectedStream.name}</span>
          </>
        )}
        {selectedSubject && (
          <>
            <ChevronRight className="w-4 h-4" />
            <span>{selectedSubject.name}</span>
          </>
        )}
        {selectedTopic && (
          <>
            <ChevronRight className="w-4 h-4" />
            <span>{selectedTopic.name}</span>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Streams Column */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">Streams</h3>
            <button
              onClick={() => openModal('stream')}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
            {streams.map((stream) => (
              <div
                key={stream._id}
                onClick={() => handleStreamSelect(stream)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedStream?._id === stream._id
                    ? 'bg-purple-100 border-purple-300'
                    : 'bg-gray-50 hover:bg-gray-100'
                } border`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{stream.name}</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {stream.subjectCount} subjects, {stream.questionCount} questions
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal('stream', stream);
                      }}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete('stream', stream._id);
                      }}
                      className="p-1 hover:bg-red-100 rounded text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subjects Column */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">Subjects</h3>
            {selectedStream && (
              <button
                onClick={() => openModal('subject')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
            {!selectedStream ? (
              <p className="text-gray-500 text-sm">Select a stream first</p>
            ) : subjects.length === 0 ? (
              <p className="text-gray-500 text-sm">No subjects yet</p>
            ) : (
              subjects.map((subject) => (
                <div
                  key={subject._id}
                  onClick={() => handleSubjectSelect(subject)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedSubject?._id === subject._id
                      ? 'bg-purple-100 border-purple-300'
                      : 'bg-gray-50 hover:bg-gray-100'
                  } border`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{subject.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {subject.topicCount} topics, {subject.questionCount} questions
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal('subject', subject);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete('subject', subject._id);
                        }}
                        className="p-1 hover:bg-red-100 rounded text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Topics Column */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">Topics</h3>
            {selectedSubject && (
              <button
                onClick={() => openModal('topic')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
            {!selectedSubject ? (
              <p className="text-gray-500 text-sm">Select a subject first</p>
            ) : topics.length === 0 ? (
              <p className="text-gray-500 text-sm">No topics yet</p>
            ) : (
              topics.map((topic) => (
                <div
                  key={topic._id}
                  onClick={() => handleTopicSelect(topic)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedTopic?._id === topic._id
                      ? 'bg-purple-100 border-purple-300'
                      : 'bg-gray-50 hover:bg-gray-100'
                  } border`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{topic.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {topic.questionCount} questions
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal('topic', topic);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete('topic', topic._id);
                        }}
                        className="p-1 hover:bg-red-100 rounded text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Questions Column */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">Questions</h3>
            {selectedTopic && (
              <button
                onClick={() => openModal('question')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
            {!selectedTopic ? (
              <p className="text-gray-500 text-sm">Select a topic first</p>
            ) : questions.length === 0 ? (
              <p className="text-gray-500 text-sm">No questions yet</p>
            ) : (
              questions.map((question) => (
                <div
                  key={question._id}
                  className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 border"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-2">{question.text}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded ${
                          question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                          question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {question.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openModal('question', question)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete('question', question._id)}
                        className="p-1 hover:bg-red-100 rounded text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editItem ? 'Edit' : 'Add'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {modalType !== 'question' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      rows="3"
                    />
                  </div>
                  
                  {modalType === 'stream' && (
                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        />
                        <span className="text-sm font-medium">Active</span>
                      </label>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Question Text</label>
                    <textarea
                      value={formData.text || ''}
                      onChange={(e) => setFormData({...formData, text: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      rows="3"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Options</label>
                    {[0, 1, 2, 3].map((index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                          type="radio"
                          name="correctOption"
                          checked={formData.correctOption === index}
                          onChange={() => setFormData({...formData, correctOption: index})}
                        />
                        <input
                          type="text"
                          value={formData.options?.[index] || ''}
                          onChange={(e) => {
                            const newOptions = [...(formData.options || ['', '', '', ''])];
                            newOptions[index] = e.target.value;
                            setFormData({...formData, options: newOptions});
                          }}
                          className="flex-1 px-3 py-2 border rounded-lg"
                          placeholder={`Option ${index + 1}`}
                          required
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Explanation</label>
                    <textarea
                      value={formData.explanation || ''}
                      onChange={(e) => setFormData({...formData, explanation: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      rows="2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Difficulty</label>
                    <select
                      value={formData.difficulty || 'medium'}
                      onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </>
              )}
              
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  {editItem ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StreamManagement;