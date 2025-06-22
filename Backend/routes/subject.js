const express = require('express');
const router = express.Router();
const {
  getSubjectsByStream,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
} = require('../controllers/subjectcontroller');

const verifyToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');

// Public routes
router.get('/stream/:streamId', getSubjectsByStream);
router.get('/:id', getSubjectById);

// Admin only routes
router.post('/', isAdmin, createSubject);
router.put('/:id', isAdmin, updateSubject);
router.delete('/:id', isAdmin, deleteSubject);

module.exports = router;