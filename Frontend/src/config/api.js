// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY: '/auth/verify-token',
    OAUTH_PATH: (provider) => `/auth/${provider}`
  },
  
  // Admin endpoints
  ADMIN: {
    LOGIN: '/admin/login',
    CREATE: '/admin/create'
  },
  
  // User endpoints
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update'
  },
  
  // Test endpoints
  TEST: {
    GENERATE: '/api/tests/generate',
    SUBMIT: '/api/tests/submit',
    HISTORY: '/api/tests/history',
    RESULTS: '/api/tests/results'
  },
  
  // Question endpoints
  QUESTION: {
    LIST: '/api/questions',
    CREATE: '/api/questions',
    UPDATE: '/api/questions',
    DELETE: '/api/questions'
  },
  
  // Stream endpoints
  STREAM: {
    LIST: '/api/streams',
    CREATE: '/api/streams',
    UPDATE: '/api/streams',
    DELETE: '/api/streams'
  },
  
  // Subject endpoints
  SUBJECT: {
    LIST: '/api/subjects',
    CREATE: '/api/subjects',
    UPDATE: '/api/subjects',
    DELETE: '/api/subjects'
  },
  
  // Topic endpoints
  TOPIC: {
    LIST: '/api/topics',
    CREATE: '/api/topics',
    UPDATE: '/api/topics',
    DELETE: '/api/topics'
  }
};

// Create full URL
export const createApiUrl = (endpoint, params = {}) => {
  let url = `${API_BASE_URL}${endpoint}`;
  
  // Add query parameters
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      queryParams.append(key, params[key]);
    }
  });
  
  const queryString = queryParams.toString();
  if (queryString) {
    url += `?${queryString}`;
  }
  
  return url;
};

// Build provider-specific OAuth URL
export const createOAuthUrl = (provider, params = {}) => {
  if (!provider) {
    throw new Error('OAuth provider is required');
  }

  const url = new URL(API_ENDPOINTS.AUTH.OAUTH_PATH(provider), API_BASE_URL);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });

  return url.toString();
};

// HTTP client with error handling
export const apiClient = {
  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      defaultOptions.headers.Authorization = `Bearer ${token}`;
    }
    
    const finalOptions = { ...defaultOptions, ...options };
    
    try {
      const response = await fetch(url, finalOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  },
  
  get(endpoint, params = {}) {
    const url = createApiUrl(endpoint, params);
    return this.request(url, { method: 'GET' });
  },
  
  post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
};

export default API_BASE_URL;