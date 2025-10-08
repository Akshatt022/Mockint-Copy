const express = require('express');
const router = express.Router();
const {
  getTopicsBySubject,
  getTopicsBySubjects,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic
} = require('../controllers/topiccontroller');

const verifyToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');

// Public routes
router.get('/subject/:subjectId', getTopicsBySubject);
router.post('/subjects', getTopicsBySubjects); // POST to send array of subject IDs
router.get('/:id', getTopicById);

// Admin only routes
router.post('/', isAdmin, createTopic);
router.put('/:id', isAdmin, updateTopic);
router.delete('/:id', isAdmin, deleteTopic);

module.exports = router;