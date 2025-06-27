import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, FileText, BarChart3, Settings, LogOut, 
  Plus, Edit2, Trash2, Search, Filter, Eye, CheckCircle,
  XCircle, Clock, TrendingUp, Award, Activity, Database
} from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { admin, logout, getAuthHeaders } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuestions: 0,
    totalTests: 0,
    totalStreams: 0
  });

  const API_BASE = 'http://localhost:5000/api';

  useEffect(() => {
    if (!admin) {
      navigate('/admin');
      return;
    }
    fetchDashboardStats();
  }, [admin, navigate]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      
      // Fetch basic stats (you can add more endpoints as needed)
      const [streamsRes, questionsRes] = await Promise.all([
        fetch(`${API_BASE}/streams`, { headers }),
        fetch(`${API_BASE}/questions`, { headers })
      ]);

      const streams = streamsRes.ok ? await streamsRes.json() : [];
      const questions = questionsRes.ok ? await questionsRes.json() : [];

      setStats({
        totalUsers: 150, // Mock data - you can add a users endpoint
        totalQuestions: Array.isArray(questions) ? questions.length : 0,
        totalTests: 45, // Mock data - you can add a tests endpoint
        totalStreams: Array.isArray(streams) ? streams.length : 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const StatCard = ({ title, value, icon: Icon, color = 'blue' }) => (
    <div className={`bg-white rounded-xl p-6 shadow-lg border-l-4 border-${color}-500`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
        </div>
        <div className={`w-12 h-12 bg-${color}-100 rounded-full flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {admin?.name}!</h1>
        <p className="text-blue-100">Manage your MockInt platform from this dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Questions"
          value={stats.totalQuestions}
          icon={FileText}
          color="green"
        />
        <StatCard
          title="Tests Taken"
          value={stats.totalTests}
          icon={CheckCircle}
          color="purple"
        />
        <StatCard
          title="Streams"
          value={stats.totalStreams}
          icon={BookOpen}
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('questions')}
            className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
          >
            <Plus className="w-6 h-6 text-blue-600" />
            <span className="font-medium text-blue-800">Add Questions</span>
          </button>
          <button
            onClick={() => setActiveTab('streams')}
            className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200"
          >
            <BookOpen className="w-6 h-6 text-green-600" />
            <span className="font-medium text-green-800">Manage Streams</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200"
          >
            <BarChart3 className="w-6 h-6 text-purple-600" />
            <span className="font-medium text-purple-800">View Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderPlaceholder = (title) => (
    <div className="bg-white rounded-xl p-8 shadow-lg text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Database className="w-12 h-12 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">This section is coming soon! You can manage {title.toLowerCase()} here.</p>
      <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
        Coming Soon
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-800">MockInt Admin</h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {admin?.role || 'Admin'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {admin?.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'questions', label: 'Questions', icon: FileText },
              { id: 'streams', label: 'Streams', icon: BookOpen },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-4 border-b-2 font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderPlaceholder('User Management')}
        {activeTab === 'questions' && renderPlaceholder('Question Management')}
        {activeTab === 'streams' && renderPlaceholder('Stream Management')}
        {activeTab === 'analytics' && renderPlaceholder('Analytics')}
        {activeTab === 'settings' && renderPlaceholder('Settings')}
      </main>
    </div>
  );
};

export default AdminDashboard;