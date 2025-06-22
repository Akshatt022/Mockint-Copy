const express = require('express');
const router = express.Router();
const {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  bulkUploadQuestions
} = require('../controllers/questioncontroller');

const isAdmin = require('../middleware/adminMiddleware');

// All question management routes require admin authentication
router.use(isAdmin);

// Question CRUD operations
router.get('/', getAllQuestions);
router.get('/:id', getQuestionById);
router.post('/', createQuestion);
router.put('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);

// Bulk operations
router.post('/bulk-upload', bulkUploadQuestions);

module.exports = router;