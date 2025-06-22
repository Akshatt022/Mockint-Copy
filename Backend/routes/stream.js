const express = require('express');
const router = express.Router();
const {
  createStream,
  getStreams,
  getStreamById,
  updateStream,
  deleteStream,
} = require('../controllers/streamcontroller');

// Routes
router.post('/', createStream);          // Create new stream
router.get('/', getStreams);              // Get all streams
router.get('/:id', getStreamById);        // Get stream by id
router.put('/:id', updateStream);         // Update stream
router.delete('/:id', deleteStream);      // Delete stream

module.exports = router;
