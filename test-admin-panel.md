# Admin Panel Test Guide

## Backend Setup
The backend server is running on port 5000 with the following admin endpoints:

### Admin Authentication
- **POST** `/admin/login` - Admin login endpoint
  - Email: `admin@mockint.com`
  - Password: `Admin123!`

### Admin API Endpoints (Protected)
- **GET** `/admin/dashboard/stats` - Get dashboard statistics
- **GET** `/admin/users` - Get all users with pagination
- **GET** `/admin/users/:id` - Get specific user details
- **PUT** `/admin/users/:id` - Update user (block/unblock)
- **DELETE** `/admin/users/:id` - Delete user
- **GET** `/admin/analytics` - Get analytics data
- **GET** `/admin/settings` - Get system settings
- **PUT** `/admin/settings` - Update system settings

## Frontend Setup
1. Make sure `VITE_ADMIN_MODE=true` is set in Frontend/.env
2. Start the frontend: `cd Frontend && npm run dev`
3. Access admin panel at: `http://localhost:3000/admin`

## Admin Panel Features Implemented

### 1. Overview Dashboard
- Total statistics (users, questions, tests, streams, subjects, topics)
- Recent test activity
- User growth charts

### 2. User Management
- User listing with search and pagination
- User details view
- Block/unblock users
- Delete users
- View user test history

### 3. Analytics
- Test performance by topic
- User activity patterns
- Stream popularity metrics

### 4. System Settings
- Maintenance mode toggle
- Registration enable/disable
- Test duration configuration
- Questions per test setting
- Passing score threshold

## Testing Steps

1. **Login to Admin Panel**
   - Navigate to `http://localhost:3000/admin`
   - Login with credentials above

2. **Test Overview Tab**
   - Verify statistics are loading
   - Check recent tests display

3. **Test User Management**
   - Search for users
   - Click on a user to view details
   - Try blocking/unblocking a user
   - Test pagination

4. **Test Analytics**
   - Switch to Analytics tab
   - Verify charts and metrics load

5. **Test Settings**
   - Switch to Settings tab
   - Modify settings
   - Save and verify changes

## Pending Features
- Question management (CRUD operations)
- Stream/Subject/Topic management
- Security logging viewer

## Security Features
- JWT-based admin authentication
- Role-based access control
- Protected API endpoints
- Admin-specific middleware