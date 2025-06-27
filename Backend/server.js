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

const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');


const app = express();
require("dotenv").config();

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
    max: 5, // limit each IP to 5 auth requests per windowMs
    message: "Too many authentication attempts, please try again later."
});

// NoSQL injection prevention
app.use(mongoSanitize());

// Basic middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, "public")));
// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

require("./config/db");

// Routes
app.use("/user", userRoute);
app.use("/auth", authLimiter, authRoute);
app.use('/admin', authLimiter, adminRoutes)
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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
