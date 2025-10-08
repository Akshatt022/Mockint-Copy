import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Edit2, Trash2, ChevronRight, BookOpen, FileText, HelpCircle,
  Copy, Move, Download, Upload, Eye, CheckSquare, Square, X,
  Save, Filter, Search, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EnhancedStreamManagement = ({ getAuthHeaders, API_BASE }) => {
  const [streams, setStreams] = useState([]);
  const [selectedStream, setSelectedStream] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  
  const [ setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({});
  
  // Bulk selection
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [bulkMode, setBulkMode] = useState(false);
  
  // Move modal
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [moveItem, setMoveItem] = useState(null);
  const [moveType, setMoveType] = useState('');
  const [moveTargets, setMoveTargets] = useState([]);
  
  // Preview modal
  const [showPreview, setShowPreview] = useState(false);
  const [previewQuestion, setPreviewQuestion] = useState(null);
  
  // Import/Export
  const fileInputRef = useRef(null);

  // Rich text editor modules
  const quillModules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, 
       {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'formula'],
      ['clean']
    ],
  };

  // Fetch functions (same as before)
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

  const fetchQuestions = async (topicId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/admin/questions/topic/${topicId}`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions);
        setSelectedQuestions([]); // Reset selection
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

  // Selection handlers
  const handleStreamSelect = (stream) => {
    setSelectedStream(stream);
    setSelectedSubject(null);
    setSelectedTopic(null);
    setSubjects([]);
    setTopics([]);
    setQuestions([]);
    setSelectedQuestions([]);
    setBulkMode(false);
    fetchSubjects(stream._id);
  };

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setSelectedTopic(null);
    setTopics([]);
    setQuestions([]);
    setSelectedQuestions([]);
    setBulkMode(false);
    fetchTopics(subject._id);
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setQuestions([]);
    setSelectedQuestions([]);
    setBulkMode(false);
    fetchQuestions(topic._id);
  };

  // Duplicate functions
  const handleDuplicate = async (type, item) => {
    try {
      let url = `${API_BASE}/admin/`;
      
      switch (type) {
        case 'topic':
          url += `topics/${item._id}/duplicate`;
          break;
        case 'question':
          url += `questions/${item._id}/duplicate`;
          break;
        default:
          return;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        // Refresh the appropriate list
        if (type === 'topic') {
          fetchTopics(selectedSubject._id);
        } else if (type === 'question') {
          fetchQuestions(selectedTopic._id);
        }
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('Error duplicating:', error);
      alert('Failed to duplicate');
    }
  };

  // Move functions
  const openMoveModal = async (type, item) => {
    setMoveType(type);
    setMoveItem(item);
    setShowMoveModal(true);

    // Load possible targets
    if (type === 'topic') {
      // Get all subjects from all streams for moving topic
      const targets = [];
      for (const stream of streams) {
        const response = await fetch(`${API_BASE}/admin/subjects/stream/${stream._id}`, {
          headers: getAuthHeaders()
        });
        if (response.ok) {
          const data = await response.json();
          data.subjects.forEach(subject => {
            if (subject._id !== selectedSubject._id) { // Exclude current subject
              targets.push({
                ...subject,
                streamName: stream.name
              });
            }
          });
        }
      }
      setMoveTargets(targets);
    } else if (type === 'question') {
      // Get all topics from current subject for moving question
      const targets = topics.filter(t => t._id !== selectedTopic._id);
      setMoveTargets(targets);
    }
  };

  const handleMove = async (targetId) => {
    try {
      let url = `${API_BASE}/admin/`;
      let body = {};

      if (moveType === 'topic') {
        url += `topics/${moveItem._id}/move`;
        body = { newSubjectId: targetId };
      } else if (moveType === 'question') {
        url += `questions/${moveItem._id}/move`;
        body = { newTopicId: targetId };
      }

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        setShowMoveModal(false);
        // Refresh lists
        if (moveType === 'topic') {
          fetchTopics(selectedSubject._id);
        } else if (moveType === 'question') {
          fetchQuestions(selectedTopic._id);
        }
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('Error moving:', error);
      alert('Failed to move');
    }
  };

  // Bulk operations
  const toggleQuestionSelection = (questionId) => {
    setSelectedQuestions(prev => {
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  };

  const selectAllQuestions = () => {
    if (selectedQuestions.length === questions.length) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(questions.map(q => q._id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedQuestions.length === 0) return;
    
    if (!confirm(`Delete ${selectedQuestions.length} questions?`)) return;

    try {
      const response = await fetch(`${API_BASE}/admin/questions/bulk-delete`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ questionIds: selectedQuestions })
      });

      if (response.ok) {
        fetchQuestions(selectedTopic._id);
        setSelectedQuestions([]);
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('Error bulk deleting:', error);
      alert('Failed to delete questions');
    }
  };

  const handleBulkDifficultyChange = async (difficulty) => {
    if (selectedQuestions.length === 0) return;

    try {
      const response = await fetch(`${API_BASE}/admin/questions/bulk-update`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          questionIds: selectedQuestions,
          updates: { difficulty }
        })
      });

      if (response.ok) {
        fetchQuestions(selectedTopic._id);
        setSelectedQuestions([]);
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('Error bulk updating:', error);
      alert('Failed to update questions');
    }
  };

  // Export/Import
  const handleExport = async (format = 'json') => {
    try {
      const url = `${API_BASE}/admin/questions/export?format=${format}${selectedTopic ? `&topicId=${selectedTopic._id}` : ''}`;
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        if (format === 'json') {
          const data = await response.json();
          const blob = new Blob([JSON.stringify(data.questions, null, 2)], { type: 'application/json' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `questions-${selectedTopic?.name || 'all'}.json`;
          a.click();
        } else if (format === 'csv') {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `questions-${selectedTopic?.name || 'all'}.csv`;
          a.click();
        }
      }
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Failed to export questions');
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const questions = JSON.parse(text);

      if (!Array.isArray(questions) || questions.length === 0) {
        alert('Invalid file format');
        return;
      }

      // If importing to specific topic, update all questions with current topic
      if (selectedTopic) {
        questions.forEach(q => {
          q.topic = selectedTopic._id;
        });
      }

      const response = await fetch(`${API_BASE}/admin/questions/import`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ questions })
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Imported ${data.count} questions successfully`);
        if (selectedTopic) {
          fetchQuestions(selectedTopic._id);
        }
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('Error importing:', error);
      alert('Failed to import questions');
    }

    // Reset file input
    event.target.value = '';
  };

  // Modal handlers
  const openModal = (type, item = null) => {
    setModalType(type);
    setEditItem(item);
    setShowModal(true);
    
    if (item) {
      if (type === 'question') {
        // Transform question data from database format to form format
        const correctOptionIndex = item.options ? 
          item.options.findIndex(opt => opt.isCorrect) : 0;
        
        setFormData({
          text: item.questionText || item.text || '',
          options: item.options ? 
            item.options.map(opt => opt.text || opt) : 
            ['', '', '', ''],
          correctOption: correctOptionIndex >= 0 ? correctOptionIndex : 0,
          explanation: item.explanation || '',
          difficulty: item.difficulty ? item.difficulty.toLowerCase() : 'medium'
        });
      } else {
        const baseData = {
          name: item.name || '',
          description: item.description || '',
          isActive: item.isActive !== undefined ? item.isActive : true
        };

        if (type === 'stream') {
          setFormData({
            ...baseData,
            resourceType: item.resourceType || '',
            resourceTitle: item.resourceTitle || '',
            resourceUrl: item.resourceUrl || '',
            resourceDescription: item.resourceDescription || ''
          });
        } else {
          setFormData(baseData);
        }
      }
    } else {
      if (type === 'question') {
        setFormData({
          text: '',
          options: ['', '', '', ''],
          correctOption: 0,
          explanation: '',
          difficulty: 'medium'
        });
      } else {
        const baseData = {
          name: '',
          description: '',
          isActive: true
        };

        if (type === 'stream') {
          setFormData({
            ...baseData,
            resourceType: '',
            resourceTitle: '',
            resourceUrl: '',
            resourceDescription: ''
          });
        } else {
          setFormData(baseData);
        }
      }
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
    
    console.log('API_BASE:', API_BASE);
    console.log('Form data:', body);
    console.log('Modal type:', modalType);
    console.log('Selected stream:', selectedStream);
    console.log('Selected subject:', selectedSubject);
    console.log('Selected topic:', selectedTopic);

    switch (modalType) {
      case 'stream':
        url += editItem ? `streams/${editItem._id}` : 'streams';
        break;
      case 'subject':
        url += editItem ? `subjects/${editItem._id}` : 'subjects';
        if (!editItem) {
          body.stream = selectedStream._id;
        } else {
          // When editing, don't send the stream field
          delete body.stream;
        }
        break;
      case 'topic':
        url += editItem ? `topics/${editItem._id}` : 'topics';
        if (!editItem) {
          body.subject = selectedSubject._id;
        } else {
          // When editing, don't send the subject field
          delete body.subject;
        }
        break;
      case 'question':
        url += editItem ? `questions/${editItem._id}` : 'questions';
        if (!editItem) {
          body.topic = selectedTopic._id;
          body.subject = selectedSubject._id;
          body.stream = selectedStream._id;
        } else {
          // When editing, don't send hierarchy fields
          delete body.topic;
          delete body.stream;
          delete body.subject;
        }
        break;
    }

    if (modalType === 'stream') {
      body.resourceType = body.resourceType ? body.resourceType : null;
      body.resourceTitle = body.resourceTitle ? body.resourceTitle.trim() : null;
      body.resourceUrl = body.resourceUrl ? body.resourceUrl.trim() : null;
      body.resourceDescription = body.resourceDescription ? body.resourceDescription.trim() : null;
      if (!body.resourceType) {
        body.resourceTitle = null;
        body.resourceUrl = null;
        body.resourceDescription = null;
      }
    }

    console.log('Final URL:', url);
    console.log('Method:', method);
    console.log('Headers:', getAuthHeaders());
    console.log('Final body being sent:', body);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        closeModal();
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
        console.log('Error response:', error);
        alert(error.message);
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save: ' + error.message);
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

  // Preview question
  const openPreview = (question) => {
    // Transform question data to ensure consistent format
    const transformedQuestion = {
      ...question,
      text: question.questionText || question.text || '',
      options: question.options || [],
      correctOption: question.options ? 
        question.options.findIndex(opt => typeof opt === 'object' && opt.isCorrect) : 
        (question.correctOption || 0),
      difficulty: question.difficulty || 'medium',
      explanation: question.explanation || ''
    };
    setPreviewQuestion(transformedQuestion);
    setShowPreview(true);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Actions */}
      <div className="flex justify-between items-center">
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
        
        <div className="flex items-center gap-2">
          {selectedTopic && (
            <>
              <button
                onClick={() => setBulkMode(!bulkMode)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  bulkMode ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {bulkMode ? 'Exit Bulk Mode' : 'Bulk Mode'}
              </button>
              
              <div className="relative group">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Download className="w-4 h-4" />
                </button>
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg hidden group-hover:block z-10">
                  <button
                    onClick={() => handleExport('json')}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Export as JSON
                  </button>
                  <button
                    onClick={() => handleExport('csv')}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Export as CSV
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Upload className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {bulkMode && selectedQuestions.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm font-medium">
            {selectedQuestions.length} question{selectedQuestions.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkDifficultyChange('easy')}
              className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
            >
              Set Easy
            </button>
            <button
              onClick={() => handleBulkDifficultyChange('medium')}
              className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
            >
              Set Medium
            </button>
            <button
              onClick={() => handleBulkDifficultyChange('hard')}
              className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
            >
              Set Hard
            </button>
            <div className="w-px h-6 bg-gray-300 mx-2" />
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

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
                    {stream.resourceType && (
                      <span className={`inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-xs font-medium ${
                        stream.resourceType === 'pdf'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {stream.resourceType === 'pdf' ? 'PDF resource' : 'External link'}
                      </span>
                    )}
                    <p className="text-xs text-gray-600 mt-1">
                      {stream.subjectCount} subjects, {stream.questionCount} questions
                    </p>
                    {stream.resourceTitle && (
                      <p className="text-xs text-gray-500 mt-1 truncate" title={stream.resourceTitle}>
                        {stream.resourceTitle}
                      </p>
                    )}
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
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  {selectedStream.resourceType
                    ? 'This stream is configured as a resource-only collection.'
                    : 'No subjects yet'}
                </p>
                {selectedStream.resourceType && selectedStream.resourceUrl && (
                  <p className="text-xs text-gray-500">
                    Resource URL: {selectedStream.resourceUrl}
                  </p>
                )}
              </div>
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
                          handleDuplicate('topic', topic);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Duplicate topic with all questions"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openMoveModal('topic', topic);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Move to different subject"
                      >
                        <Move className="w-3 h-3" />
                      </button>
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
            <div className="flex items-center gap-2">
              {bulkMode && questions.length > 0 && (
                <button
                  onClick={selectAllQuestions}
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  {selectedQuestions.length === questions.length ? 'Deselect All' : 'Select All'}
                </button>
              )}
              {selectedTopic && (
                <button
                  onClick={() => openModal('question')}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
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
                  className={`p-3 rounded-lg border transition-colors ${
                    selectedQuestions.includes(question._id)
                      ? 'bg-purple-50 border-purple-300'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {bulkMode && (
                      <input
                        type="checkbox"
                        checked={selectedQuestions.includes(question._id)}
                        onChange={() => toggleQuestionSelection(question._id)}
                        className="mt-1"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-2">{question.questionText || question.text || 'Untitled Question'}</p>
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
                        onClick={() => openPreview(question)}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Preview"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDuplicate('question', question)}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Duplicate"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => openMoveModal('question', question)}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Move to different topic"
                      >
                        <Move className="w-3 h-3" />
                      </button>
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

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1">Attached Resource</label>
                        <select
                          value={formData.resourceType || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormData({
                              ...formData,
                              resourceType: value,
                              ...(value ? {} : {
                                resourceTitle: '',
                                resourceUrl: '',
                                resourceDescription: ''
                              })
                            });
                          }}
                          className="w-full px-3 py-2 border rounded-lg"
                        >
                          <option value="">No attached resource</option>
                          <option value="pdf">PDF download</option>
                          <option value="link">External link</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Resource Title</label>
                        <input
                          type="text"
                          value={formData.resourceTitle || ''}
                          onChange={(e) => setFormData({...formData, resourceTitle: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="Capgemini Pseudo Questions"
                          disabled={!formData.resourceType}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Resource URL</label>
                        <input
                          type="text"
                          value={formData.resourceUrl || ''}
                          onChange={(e) => setFormData({...formData, resourceUrl: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="/resources/capgemini-pseudo.pdf"
                          disabled={!formData.resourceType}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          For PDFs hosted on this server, place the file in <code>Backend/public/resources</code> and use a path like <code>/resources/file.pdf</code>.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Resource Notes</label>
                        <textarea
                          value={formData.resourceDescription || ''}
                          onChange={(e) => setFormData({...formData, resourceDescription: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg"
                          rows="2"
                          placeholder="Short note shown to admins about the attached PDF"
                          disabled={!formData.resourceType}
                        />
                      </div>

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
                    </>
                  )}
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Question Text</label>
                    <ReactQuill
                      theme="snow"
                      value={formData.text || ''}
                      onChange={(value) => setFormData({...formData, text: value})}
                      modules={quillModules}
                      className="h-32 mb-12"
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
                    <ReactQuill
                      theme="snow"
                      value={formData.explanation || ''}
                      onChange={(value) => setFormData({...formData, explanation: value})}
                      modules={quillModules}
                      className="h-24 mb-12"
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

      {/* Move Modal */}
      {showMoveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[70vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              Move {moveType} to:
            </h2>
            
            <div className="space-y-2">
              {moveTargets.map((target) => (
                <button
                  key={target._id}
                  onClick={() => handleMove(target._id)}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-purple-50 rounded-lg border hover:border-purple-300"
                >
                  <div className="font-medium">{target.name}</div>
                  {target.streamName && (
                    <div className="text-sm text-gray-600">in {target.streamName}</div>
                  )}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowMoveModal(false)}
              className="mt-4 w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && previewQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Question Preview</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: previewQuestion.text }}
                />
              </div>
              
              <div className="space-y-2">
                {previewQuestion.options && previewQuestion.options.map((option, index) => {
                  // Handle both string options and object options
                  const optionText = typeof option === 'string' ? option : (option.text || option);
                  const isCorrect = typeof option === 'object' && option.isCorrect ? true : index === previewQuestion.correctOption;
                  
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        isCorrect
                          ? 'bg-green-50 border-green-300'
                          : 'bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                        <span>{optionText}</span>
                        {isCorrect && (
                          <CheckSquare className="w-4 h-4 text-green-600 ml-auto" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {previewQuestion.explanation && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Explanation
                  </h4>
                  <div 
                    className="prose max-w-none text-sm"
                    dangerouslySetInnerHTML={{ __html: previewQuestion.explanation }}
                  />
                </div>
              )}
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Difficulty: <span className={`font-medium ${
                  previewQuestion.difficulty === 'easy' ? 'text-green-600' :
                  previewQuestion.difficulty === 'medium' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>{previewQuestion.difficulty}</span></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedStreamManagement;
