import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, FileText, BarChart3, Settings, LogOut, 
  Plus, Edit2, Trash2, Search, Filter, Eye, CheckCircle,
  XCircle, Clock, TrendingUp, Award, Activity, Database,
  RefreshCw, Ban, UserCheck, Calendar, ChevronLeft, ChevronRight,
  Download, Mail, Phone, MapPin, Shield, HelpCircle
} from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { useNavigate } from 'react-router-dom';
import EnhancedStreamManagement from '../components/admin/EnhancedStreamManagement';

const AdminDashboard = () => {
  const { admin, logout, getAuthHeaders } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    users: 0,
    questions: 0,
    tests: 0,
    streams: 0,
    subjects: 0,
    topics: 0
  });
  const [recentTests, setRecentTests] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  
  // User management state
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [totalUserPages, setTotalUserPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userTestHistory, setUserTestHistory] = useState([]);
  
  // Analytics state
  const [analytics, setAnalytics] = useState({
    testPerformance: [],
    userActivity: [],
    streamPopularity: []
  });
  
  // Settings state
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    registrationEnabled: true,
    testDuration: 30,
    questionsPerTest: 20,
    passingScore: 70,
    maxLoginAttempts: 5,
    lockoutDuration: 15
  });

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

  useEffect(() => {
    if (!admin) {
      navigate('/admin');
      return;
    }
    
    // Load data based on active tab
    switch(activeTab) {
      case 'overview':
        fetchDashboardStats();
        break;
      case 'users':
        fetchUsers();
        break;
      case 'analytics':
        fetchAnalytics();
        break;
      case 'settings':
        fetchSettings();
        break;
    }
  }, [admin, navigate, activeTab, userPage, userSearch]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/admin/dashboard/stats`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentTests(data.recentTests || []);
        setUserGrowth(data.userGrowth || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: userPage,
        limit: 10,
        search: userSearch
      });
      
      const response = await fetch(`${API_BASE}/admin/users?${params}`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setTotalUserPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        setSelectedUser(data.user);
        setUserTestHistory(data.testHistory || []);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const updateUser = async (userId, updates) => {
    try {
      const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      
      if (response.ok) {
        fetchUsers();
        if (selectedUser?._id === userId) {
          fetchUserDetails(userId);
        }
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        fetchUsers();
        setSelectedUser(null);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/admin/analytics`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/admin/settings`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        setSystemSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/settings`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(systemSettings)
      });
      
      if (response.ok) {
        alert('Settings updated successfully');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'questions', label: 'Questions', icon: FileText },
    { id: 'streams', label: 'Streams', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
              <span className="ml-4 px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                {admin?.role || 'Admin'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {admin?.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Users</p>
                        <p className="text-3xl font-bold text-gray-800">{stats.users}</p>
                      </div>
                      <Users className="w-10 h-10 text-blue-500" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Questions</p>
                        <p className="text-3xl font-bold text-gray-800">{stats.questions}</p>
                      </div>
                      <FileText className="w-10 h-10 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Tests Taken</p>
                        <p className="text-3xl font-bold text-gray-800">{stats.tests}</p>
                      </div>
                      <Award className="w-10 h-10 text-purple-500" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Streams</p>
                        <p className="text-3xl font-bold text-gray-800">{stats.streams}</p>
                      </div>
                      <BookOpen className="w-10 h-10 text-orange-500" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Subjects</p>
                        <p className="text-3xl font-bold text-gray-800">{stats.subjects}</p>
                      </div>
                      <Database className="w-10 h-10 text-indigo-500" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Topics</p>
                        <p className="text-3xl font-bold text-gray-800">{stats.topics}</p>
                      </div>
                      <Activity className="w-10 h-10 text-red-500" />
                    </div>
                  </div>
                </div>

                {/* Recent Tests */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Recent Tests</h2>
                  </div>
                  <div className="p-6">
                    {recentTests.length === 0 ? (
                      <p className="text-gray-500 text-center">No recent tests</p>
                    ) : (
                      <div className="space-y-4">
                        {recentTests.map((test) => (
                          <div key={test._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">{test.userId?.name || 'Unknown User'}</p>
                              <p className="text-sm text-gray-600">{test.topicId?.name || 'Unknown Topic'}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{test.score}%</p>
                              <p className="text-sm text-gray-600">{formatDate(test.createdAt)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Users List */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow">
                  <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-gray-800">User Management</h2>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Search users..."
                          value={userSearch}
                          onChange={(e) => setUserSearch(e.target.value)}
                          className="px-3 py-2 border rounded-lg text-sm"
                        />
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <Search className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {users.map((user) => (
                        <div
                          key={user._id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                          onClick={() => fetchUserDetails(user._id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {user.isActive ? (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Active</span>
                            ) : (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Inactive</span>
                            )}
                            {user.isBlocked && (
                              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Blocked</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Pagination */}
                    <div className="flex justify-center items-center gap-2 mt-6">
                      <button
                        onClick={() => setUserPage(p => Math.max(1, p - 1))}
                        disabled={userPage === 1}
                        className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-sm text-gray-600">
                        Page {userPage} of {totalUserPages}
                      </span>
                      <button
                        onClick={() => setUserPage(p => Math.min(totalUserPages, p + 1))}
                        disabled={userPage === totalUserPages}
                        className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* User Details */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">User Details</h2>
                  </div>
                  <div className="p-6">
                    {selectedUser ? (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                            {selectedUser.name.charAt(0).toUpperCase()}
                          </div>
                          <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                          <p className="text-sm text-gray-600">{selectedUser.email}</p>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Phone:</span>
                            <span>{selectedUser.phone || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Joined:</span>
                            <span>{formatDate(selectedUser.createdAt)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Last Login:</span>
                            <span>{selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : 'Never'}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pt-4">
                          <button
                            onClick={() => updateUser(selectedUser._id, { isBlocked: !selectedUser.isBlocked })}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${
                              selectedUser.isBlocked
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-red-500 text-white hover:bg-red-600'
                            }`}
                          >
                            {selectedUser.isBlocked ? 'Unblock' : 'Block'}
                          </button>
                          <button
                            onClick={() => deleteUser(selectedUser._id)}
                            className="flex-1 px-3 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600"
                          >
                            Delete
                          </button>
                        </div>
                        
                        {/* Test History */}
                        <div className="pt-4 border-t">
                          <h4 className="font-medium mb-2">Recent Tests</h4>
                          <div className="space-y-2">
                            {userTestHistory.map((test) => (
                              <div key={test._id} className="text-sm">
                                <div className="flex justify-between">
                                  <span>{test.topicId?.name}</span>
                                  <span className="font-medium">{test.score}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center">Select a user to view details</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Questions Tab - Redirects to Streams Tab */}
            {activeTab === 'questions' && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center py-8">
                  <HelpCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Question Management</h2>
                  <p className="text-gray-600 mb-4">Questions are managed through the Stream hierarchy</p>
                  <button
                    onClick={() => setActiveTab('streams')}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                  >
                    Go to Content Management
                  </button>
                </div>
              </div>
            )}

            {/* Streams Tab - Full Content Management */}
            {activeTab === 'streams' && (
              <div>
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-2">Content Management</h2>
                  <p className="text-gray-600">Manage your educational content hierarchy: Streams → Subjects → Topics → Questions</p>
                </div>
                <EnhancedStreamManagement 
                  getAuthHeaders={getAuthHeaders}
                  API_BASE={API_BASE}
                />
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {/* Test Performance */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Test Performance by Topic</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {analytics.testPerformance.map((topic) => (
                        <div key={topic.topicName} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{topic.topicName}</p>
                            <p className="text-sm text-gray-600">{topic.totalTests} tests taken</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{topic.avgScore}% avg score</p>
                            <p className="text-sm text-gray-600">{topic.avgTimeTaken} min avg time</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stream Popularity */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Stream Popularity</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {analytics.streamPopularity.map((stream) => (
                        <div key={stream._id} className="flex items-center justify-between">
                          <p className="font-medium">{stream.streamName}</p>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-purple-600 h-2 rounded-full"
                                style={{ width: `${(stream.testCount / Math.max(...analytics.streamPopularity.map(s => s.testCount))) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 w-16 text-right">{stream.testCount} tests</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold text-gray-800">System Settings</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={systemSettings.maintenanceMode}
                          onChange={(e) => setSystemSettings({...systemSettings, maintenanceMode: e.target.checked})}
                          className="w-4 h-4"
                        />
                        <span className="font-medium">Maintenance Mode</span>
                      </label>
                      <p className="text-sm text-gray-600 ml-7">Enable maintenance mode to prevent user access</p>
                    </div>
                    
                    <div>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={systemSettings.registrationEnabled}
                          onChange={(e) => setSystemSettings({...systemSettings, registrationEnabled: e.target.checked})}
                          className="w-4 h-4"
                        />
                        <span className="font-medium">Registration Enabled</span>
                      </label>
                      <p className="text-sm text-gray-600 ml-7">Allow new users to register</p>
                    </div>
                    
                    <div>
                      <label className="block font-medium mb-2">Test Duration (minutes)</label>
                      <input
                        type="number"
                        value={systemSettings.testDuration}
                        onChange={(e) => setSystemSettings({...systemSettings, testDuration: parseInt(e.target.value)})}
                        className="px-3 py-2 border rounded-lg w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block font-medium mb-2">Questions Per Test</label>
                      <input
                        type="number"
                        value={systemSettings.questionsPerTest}
                        onChange={(e) => setSystemSettings({...systemSettings, questionsPerTest: parseInt(e.target.value)})}
                        className="px-3 py-2 border rounded-lg w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block font-medium mb-2">Passing Score (%)</label>
                      <input
                        type="number"
                        value={systemSettings.passingScore}
                        onChange={(e) => setSystemSettings({...systemSettings, passingScore: parseInt(e.target.value)})}
                        className="px-3 py-2 border rounded-lg w-full"
                      />
                    </div>
                    
                    <button
                      onClick={updateSettings}
                      className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700"
                    >
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;