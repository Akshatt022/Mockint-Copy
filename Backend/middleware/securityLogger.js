const fs = require('fs').promises;
const path = require('path');

// Create logs directory if it doesn't exist
const ensureLogDirectory = async () => {
  const logDir = path.join(__dirname, '../logs');
  try {
    await fs.access(logDir);
  } catch {
    await fs.mkdir(logDir, { recursive: true });
  }
};

// Security event logger
const logSecurityEvent = async (event, req, additionalInfo = {}) => {
  await ensureLogDirectory();
  
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    url: req.originalUrl,
    method: req.method,
    userId: req.user?.id || null,
    userEmail: req.user?.email || null,
    ...additionalInfo
  };

  const logFile = path.join(__dirname, '../logs', 'security.log');
  const logLine = JSON.stringify(logEntry) + '\n';

  try {
    await fs.appendFile(logFile, logLine);
  } catch (error) {
    console.error('Failed to write security log:', error);
  }
};

// Track failed login attempts
const failedLoginAttempts = new Map();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

const trackFailedLogin = async (req, email) => {
  const key = `${req.ip}-${email}`;
  const now = Date.now();
  
  if (!failedLoginAttempts.has(key)) {
    failedLoginAttempts.set(key, { count: 1, firstAttempt: now, lockedUntil: null });
  } else {
    const attempts = failedLoginAttempts.get(key);
    attempts.count++;
    
    if (attempts.count >= MAX_FAILED_ATTEMPTS) {
      attempts.lockedUntil = now + LOCKOUT_DURATION;
      await logSecurityEvent('ACCOUNT_LOCKOUT', req, { 
        email, 
        attemptCount: attempts.count,
        lockoutDuration: LOCKOUT_DURATION 
      });
    }
  }

  await logSecurityEvent('LOGIN_FAILED', req, { 
    email, 
    attemptCount: failedLoginAttempts.get(key).count 
  });
};

const isAccountLocked = (req, email) => {
  const key = `${req.ip}-${email}`;
  const attempts = failedLoginAttempts.get(key);
  
  if (!attempts || !attempts.lockedUntil) return false;
  
  if (Date.now() > attempts.lockedUntil) {
    failedLoginAttempts.delete(key);
    return false;
  }
  
  return true;
};

const clearFailedAttempts = (req, email) => {
  const key = `${req.ip}-${email}`;
  failedLoginAttempts.delete(key);
};

// Middleware to log authentication events
const authLogger = (req, res, next) => {
  const originalJson = res.json;
  
  res.json = function(data) {
    // Log successful login
    if (req.path.includes('/login') && req.method === 'POST' && data.success) {
      logSecurityEvent('LOGIN_SUCCESS', req, { 
        email: req.body?.email,
        userAgent: req.get('User-Agent')
      });
    }
    
    // Log failed login
    if (req.path.includes('/login') && req.method === 'POST' && !data.success) {
      trackFailedLogin(req, req.body?.email);
    }
    
    // Log registration
    if (req.path.includes('/register') && req.method === 'POST' && data.success) {
      logSecurityEvent('USER_REGISTERED', req, { 
        email: req.body?.email 
      });
    }
    
    return originalJson.call(this, data);
  };
  
  next();
};

// Middleware to check for suspicious activity
const suspiciousActivityDetector = async (req, res, next) => {
  // Check for account lockout
  if (req.path.includes('/login') && req.body?.email) {
    if (isAccountLocked(req, req.body.email)) {
      await logSecurityEvent('LOGIN_ATTEMPT_WHILE_LOCKED', req, { 
        email: req.body.email 
      });
      return res.status(429).json({ 
        success: false,
        message: 'Account temporarily locked due to too many failed attempts. Try again later.' 
      });
    }
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /(<script|javascript:|data:)/i,
    /(union|select|insert|update|delete|drop|create|alter)/i,
    /(\.\./|\.\.\\)/g // Path traversal
  ];

  const requestString = JSON.stringify(req.body) + req.originalUrl;
  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(requestString));

  if (isSuspicious) {
    await logSecurityEvent('SUSPICIOUS_REQUEST', req, { 
      suspiciousContent: requestString.substring(0, 500) 
    });
  }

  next();
};

module.exports = {
  logSecurityEvent,
  trackFailedLogin,
  isAccountLocked,
  clearFailedAttempts,
  authLogger,
  suspiciousActivityDetector
};