const express = require('express');
const router = express.Router();
const {
  generateTest,
  submitTest,
  getTestHistory,
  getTestResult
} = require('../controllers/testcontroller');

const verifyToken = require('../middleware/authMiddleware');

// All test routes require authentication
router.use(verifyToken);

// Test generation and submission
router.post('/generate', generateTest);
router.post('/submit', submitTest);

// Test history and results
router.get('/history', getTestHistory);
router.get('/result/:id', getTestResult);

module.exports = router;