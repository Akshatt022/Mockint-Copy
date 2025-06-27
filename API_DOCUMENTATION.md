# MockInt API Documentation

## Overview

MockInt is a comprehensive online testing platform providing mock interview and test preparation for various competitive exams including JEE, CAT, NEET, GATE, and UPSC.

**Base URL:** `http://localhost:5000` (Development)  
**API Version:** v1  
**Authentication:** JWT Bearer Token  

## Authentication

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "phone": "9876543210",
  "addresses": [
    {
      "address": "123 Main St",
      "state": "California",
      "city": "Los Angeles",
      "pincode": 90210
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "statusCode": 201
}
```

### Login User
**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "statusCode": 200
}
```

### Verify Token
**GET** `/auth/verify-token`

Verify JWT token validity.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210"
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "statusCode": 200
}
```

## Admin Authentication

### Admin Login
**POST** `/admin/login`

Authenticate admin user.

**Request Body:**
```json
{
  "email": "admin@mockint.com",
  "password": "SecureAdminPassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "name": "System Administrator"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "statusCode": 200
}
```

## Streams

### Get All Streams
**GET** `/api/streams`

Retrieve all available test streams.

**Response:**
```json
{
  "success": true,
  "message": "Streams retrieved successfully",
  "data": [
    {
      "_id": "stream_id",
      "name": "JEE",
      "description": "Joint Entrance Examination for Engineering"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z",
  "statusCode": 200
}
```

## Subjects

### Get Subjects by Stream
**GET** `/api/subjects?stream=<stream_id>`

Retrieve subjects for a specific stream.

**Query Parameters:**
- `stream` (required): Stream ID

**Response:**
```json
{
  "success": true,
  "message": "Subjects retrieved successfully",
  "data": [
    {
      "_id": "subject_id",
      "name": "Physics",
      "stream": "stream_id"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z",
  "statusCode": 200
}
```

## Topics

### Get Topics by Subject
**GET** `/api/topics?subject=<subject_id>`

Retrieve topics for a specific subject.

**Query Parameters:**
- `subject` (required): Subject ID

**Response:**
```json
{
  "success": true,
  "message": "Topics retrieved successfully",
  "data": [
    {
      "_id": "topic_id",
      "name": "Mechanics",
      "subject": "subject_id",
      "description": "Classical mechanics and motion"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z",
  "statusCode": 200
}
```

## Questions

### Get Questions (Admin)
**GET** `/api/questions`

Retrieve questions with filtering and pagination.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `streamId` (optional): Filter by stream
- `subjectId` (optional): Filter by subject
- `topicId` (optional): Filter by topic
- `difficulty` (optional): Filter by difficulty (Easy, Medium, Hard)
- `search` (optional): Search in question text

**Response:**
```json
{
  "success": true,
  "message": "Questions retrieved successfully",
  "data": [
    {
      "_id": "question_id",
      "questionText": "What is the acceleration due to gravity?",
      "options": [
        { "text": "9.8 m/s²", "isCorrect": true },
        { "text": "10 m/s²", "isCorrect": false }
      ],
      "explanation": "Standard gravity is approximately 9.8 m/s²",
      "difficulty": "Easy",
      "stream": { "_id": "stream_id", "name": "JEE" },
      "subject": { "_id": "subject_id", "name": "Physics" },
      "topic": { "_id": "topic_id", "name": "Mechanics" }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "itemsPerPage": 20,
    "hasNextPage": true,
    "hasPrevPage": false,
    "nextPage": 2,
    "prevPage": null
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "statusCode": 200
}
```

## Tests

### Generate Test
**POST** `/api/tests/generate`

Generate a new test based on selected criteria.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "stream": "stream_id",
  "subjects": ["subject_id1", "subject_id2"],
  "topics": ["topic_id1", "topic_id2"],
  "questionCount": 50,
  "timeLimit": 7200,
  "difficulty": "Mixed"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Test generated successfully",
  "data": {
    "testId": "test_id",
    "questions": [
      {
        "_id": "question_id",
        "questionText": "Sample question?",
        "options": [
          { "text": "Option A", "isCorrect": false },
          { "text": "Option B", "isCorrect": true }
        ]
      }
    ],
    "timeLimit": 7200,
    "totalQuestions": 50
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "statusCode": 200
}
```

### Submit Test
**POST** `/api/tests/submit`

Submit completed test for evaluation.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "testId": "test_id",
  "answers": {
    "question_id1": 0,
    "question_id2": 1
  },
  "timeSpent": 3600,
  "startTime": "2024-01-01T10:00:00.000Z",
  "endTime": "2024-01-01T11:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Test submitted successfully",
  "data": {
    "score": 85,
    "correctAnswers": 42,
    "wrongAnswers": 8,
    "totalQuestions": 50,
    "percentage": 84,
    "timeTaken": 3600,
    "resultId": "result_id"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "statusCode": 200
}
```

### Get Test History
**GET** `/api/tests/history`

Retrieve user's test history.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "message": "Test history retrieved successfully",
  "data": [
    {
      "_id": "result_id",
      "stream": { "name": "JEE" },
      "subject": { "name": "Physics" },
      "score": 85,
      "percentage": 85,
      "totalQuestions": 50,
      "correctAnswers": 42,
      "wrongAnswers": 8,
      "completionTime": 3600,
      "createdAt": "2024-01-01T10:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 25,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "statusCode": 200
}
```

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z",
  "statusCode": 400
}
```

### Common Error Codes

- **400 Bad Request**: Invalid request data or validation errors
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

## Rate Limiting

- **General API**: 100 requests per 15 minutes per IP
- **Authentication endpoints**: 5 requests per 15 minutes per IP
- **Failed login attempts**: Account locked for 15 minutes after 5 failed attempts

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- NoSQL injection prevention
- Rate limiting
- CORS protection
- Security headers (Helmet.js)
- Request logging and monitoring

## Development Setup

1. Install dependencies: `npm install`
2. Set up environment variables (see `.env.example`)
3. Start development server: `npm run dev`
4. Run tests: `npm test`
5. Generate API documentation: Review this file

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure production database URL
3. Set secure JWT secret
4. Configure CORS for production domains
5. Set up SSL/TLS certificates
6. Configure logging and monitoring