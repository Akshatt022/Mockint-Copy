require("dotenv").config();

const express = require("express");

const path = require("path");
const userRoute = require("./routes/user");
const testRoutes = require("./routes/test");
const authRoute = require("./routes/auth");
const streamRoutes = require('./routes/stream');
const topicRoutes = require("./routes/topic");
const adminRoutes = require('./routes/admin');
const subjectRoutes = require("./routes/subject");
const questionRoutes = require("./routes/question");
const { ensureDefaultStreams } = require('./utils/ensureDefaultStreams');
const session = require('express-session');
const passport = require('./utils/passport');
const cors = require('cors');

const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');


const app = express();

const normalizeOrigin = (origin) => origin ? origin.replace(/\/$/, '') : origin;

const additionalCorsOrigins = (process.env.ADDITIONAL_CORS_ORIGINS || '')
  .split(',')
  .map(origin => normalizeOrigin(origin.trim()))
  .filter(Boolean);

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  normalizeOrigin(process.env.FRONTEND_URL),
  ...additionalCorsOrigins
].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    const requestOrigin = normalizeOrigin(origin);
    if (!origin || allowedOrigins.includes(requestOrigin)) {
      return callback(null, true);
    }
    console.warn('CORS blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));



// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        }
    }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

// Auth rate limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // increased to 20 auth requests per windowMs for development
    message: "Too many authentication attempts, please try again later."
});

// NoSQL injection prevention
app.use(mongoSanitize());

// Basic middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, "public")));


require("./config/db");
ensureDefaultStreams().catch((err) => {
    console.error('Failed to ensure default streams:', err);
});

// Health check endpoint (should be before other routes)
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'MockInt Backend API',
        version: '1.0.0',
        status: 'Running'
    });
});


//passport integration


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use("/user", userRoute);
app.use("/auth", authRoute);
app.use('/admin', adminRoutes) // Temporarily removed authLimiter for testing
app.use('/api/streams', streamRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/questions', questionRoutes);

// Error handling middleware (must be last)
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));




