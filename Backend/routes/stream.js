const express = require('express');
const router = express.Router();
const {
  getAllStreams,
  getStreamById,
  createStream,
  updateStream,
  deleteStream
} = require('../controllers/streamcontroller');

const verifyToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');

// Public routes
router.get('/', getAllStreams);
router.get('/:id', getStreamById);

// Admin only routes
router.post('/', isAdmin, createStream);
router.put('/:id', isAdmin, updateStream);
router.delete('/:id', isAdmin, deleteStream);

module.exports = router;