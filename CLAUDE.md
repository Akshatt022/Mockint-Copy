# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MockInt is a comprehensive online testing/quiz platform with:
- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend**: Express.js + MongoDB/Mongoose + JWT authentication
- **Purpose**: Mock interview/test preparation system supporting multiple exam types (JEE, CAT, NEET, GATE, UPSC)

## Development Commands

### Backend (from `/Backend` directory)
```bash
npm install          # Install dependencies
npm run dev          # Start development server with nodemon (port 5000)
npm start            # Same as npm run dev
```

### Frontend (from `/Frontend` directory)
```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server (port 3000)
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Database Setup
```bash
cd Backend
node scripts/seedDatabase.js  # Populate database with initial data
```

**Note**: Currently the seed script has hardcoded MongoDB connection. Update line 8 in `seedDatabase.js` to use environment variables.

## Architecture

### Backend Structure
- **MVC Pattern**: Models → Controllers → Routes
- **Authentication**: JWT-based with separate admin/user roles
- **Validation**: Joi schemas in model files
- **Middleware**: Auth (`authMiddleware.js`) and Admin (`adminMiddleware.js`) protection

### Data Hierarchy
```
Stream (JEE, CAT, etc.)
  └── Subject (Physics, Math, etc.)
      └── Topic (Kinematics, Algebra, etc.)
          └── Question (Multiple choice with 4 options)
```

### API Endpoints
- `/auth` - Login, register, logout
- `/user` - User profile and management
- `/admin` - Admin operations (protected)
- `/api/streams` - Educational streams
- `/api/subjects` - Subjects within streams
- `/api/topics` - Topics within subjects
- `/api/tests` - Test operations and results
- `/api/questions` - Question management

### Frontend Architecture
- **Pages**: Route-level components in `/src/pages`
- **Components**: Reusable UI components in `/src/components`
- **Styling**: Tailwind CSS + CSS Modules
- **State**: React Context for theme, custom hooks for data
- **Admin Mode**: Enable with `VITE_ADMIN_MODE=true` environment variable

## Environment Variables

### Backend (.env)
```
MONGOURI=mongodb://localhost:27017/mockint
JWT_SECRET=your_jwt_secret_here
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
VITE_ADMIN_MODE=true  # Enable admin features
```

## Key Development Patterns

### Backend Controller Pattern
```javascript
// Use Joi for validation
const schema = Joi.object({
  field: Joi.string().required()
});
const { error } = schema.validate(req.body);

// Handle errors with appropriate status codes
if (error) return res.status(400).json({ message: error.details[0].message });

// Use try-catch for async operations
try {
  // Business logic
  res.status(200).json({ success: true, data });
} catch (error) {
  res.status(500).json({ message: 'Server error' });
}
```

### Authentication Flow
1. User registers/logs in → receives JWT token
2. Protected routes check token via `authMiddleware`
3. Admin routes additionally check role via `adminMiddleware`
4. Token stored in frontend and sent as Authorization header

## Common Tasks

### Adding a New API Endpoint
1. Create controller function in appropriate controller file
2. Add route in corresponding routes file
3. Apply middleware if authentication needed
4. Update frontend API calls in `/Frontend/src/api`

### Creating New Components
1. Check existing components for patterns and styling approach
2. Use CSS Modules for component-specific styles
3. Use Tailwind classes for utility styling
4. Place in `/Frontend/src/components` with PascalCase naming

### Database Operations
- Models use Mongoose schemas with built-in validation
- Joi validation schemas are defined alongside Mongoose models
- Always validate input data before database operations

## Security Features
- JWT token-based authentication with 2-hour expiration
- Password hashing with bcryptjs (10 salt rounds)
- Input validation with Joi schemas
- NoSQL injection prevention (express-mongo-sanitize)
- Rate limiting (100 requests/15min general, 5 requests/15min auth)
- Security headers with Helmet.js
- CORS configuration with origin restrictions
- Request logging and security event monitoring
- Account lockout after 5 failed login attempts (15-minute lockout)

## Testing & Quality Assurance
- Jest testing framework configured
- Supertest for API testing
- MongoDB Memory Server for test database
- Test coverage reporting
- Test scripts: `npm test`, `npm run test:watch`, `npm run test:coverage`

## API Documentation
- Comprehensive API documentation in `API_DOCUMENTATION.md`
- Standardized response format across all endpoints
- Error handling with detailed error responses
- Request/response examples for all endpoints

## Recent Improvements (Fixed Issues)
✅ **Security Vulnerabilities Fixed:**
- Removed hardcoded MongoDB credentials
- Fixed JWT token inconsistencies
- Added proper CORS configuration
- Implemented rate limiting and security middleware

✅ **Database Performance:**
- Added indexes for User, Admin, Question, TestResult models
- Fixed model reference mismatches
- Removed duplicate data structures
- Added data integrity validations

✅ **API Design:**
- Standardized response format
- Global error handling middleware
- Input validation middleware
- Async error handling wrapper

✅ **Configuration:**
- Environment-based configuration
- Updated dependencies to stable versions
- Added security and validation packages
- Proper error handling and logging

## Current Capabilities
- Full authentication system with JWT
- Role-based access control (User/Admin)
- Comprehensive test management system
- Question bank with filtering and pagination
- Real-time test interface with timer
- Test result analytics and history
- Security logging and monitoring
- Input validation and sanitization
- Performance optimizations with database indexes