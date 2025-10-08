const express = require("express");
const router = express.Router();
const adminController = require('../controllers/admincontroller');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public admin routes (no authentication required)
router.post('/login', adminController.adminLogin);

// Protected admin routes (require authentication)
// Dashboard
router.get('/dashboard/stats', adminMiddleware, adminController.getDashboardStats);

// User Management
router.get('/users', adminMiddleware, adminController.getAllUsers);
router.get('/users/:id', adminMiddleware, adminController.getUserById);
router.put('/users/:id', adminMiddleware, adminController.updateUser);
router.delete('/users/:id', adminMiddleware, adminController.deleteUser);

// Analytics
router.get('/analytics', adminMiddleware, adminController.getAnalytics);

// System Settings
router.get('/settings', adminMiddleware, adminController.getSystemSettings);
router.put('/settings', adminMiddleware, adminController.updateSystemSettings);

// Stream Management
router.get('/streams', adminMiddleware, adminController.getAllStreams);
router.post('/streams', adminMiddleware, adminController.createStream);
router.put('/streams/:id', adminMiddleware, adminController.updateStream);
router.delete('/streams/:id', adminMiddleware, adminController.deleteStream);

// Subject Management
router.get('/subjects/stream/:streamId', adminMiddleware, adminController.getSubjectsByStream);
router.post('/subjects', adminMiddleware, adminController.createSubject);
router.put('/subjects/:id', adminMiddleware, adminController.updateSubject);
router.delete('/subjects/:id', adminMiddleware, adminController.deleteSubject);

// Topic Management
router.get('/topics/subject/:subjectId', adminMiddleware, adminController.getTopicsBySubject);
router.post('/topics', adminMiddleware, adminController.createTopic);
router.put('/topics/:id', adminMiddleware, adminController.updateTopic);
router.delete('/topics/:id', adminMiddleware, adminController.deleteTopic);

// Question Management
router.get('/questions/topic/:topicId', adminMiddleware, adminController.getQuestionsByTopic);
router.post('/questions', adminMiddleware, adminController.createQuestion);
router.put('/questions/:id', adminMiddleware, adminController.updateQuestion);
router.delete('/questions/:id', adminMiddleware, adminController.deleteQuestion);

// Advanced Operations
router.post('/questions/:id/duplicate', adminMiddleware, adminController.duplicateQuestion);
router.post('/topics/:id/duplicate', adminMiddleware, adminController.duplicateTopic);
router.put('/topics/:id/move', adminMiddleware, adminController.moveTopic);
router.put('/questions/:id/move', adminMiddleware, adminController.moveQuestion);
router.post('/questions/bulk-delete', adminMiddleware, adminController.bulkDeleteQuestions);
router.put('/questions/bulk-update', adminMiddleware, adminController.bulkUpdateQuestions);
router.get('/questions/export', adminMiddleware, adminController.exportQuestions);
router.post('/questions/import', adminMiddleware, adminController.importQuestions);

module.exports = router;
