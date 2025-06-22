const { Topic, validateTopic } = require("../models/Topic");
const { Stream } = require("../models/stream"); // To ensure stream exists

// Create a new topic
const createTopic = async (req, res) => {
  const { error } = validateTopic(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { name, stream, description } = req.body;

  try {
    const streamExists = await Stream.findById(stream);
    if (!streamExists) return res.status(404).json({ message: "Stream not found" });

    const topic = new Topic({ name, stream, description });
    await topic.save();
    res.status(201).json({ message: "Topic created successfully", topic });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all topics 
const getTopics = async (req, res) => {
  try {
    const filter = {};
    if (req.query.stream) {
      filter.stream = req.query.stream;
    }

    const topics = await Topic.find(filter).populate("stream", "name");
    res.json(topics);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getTopicsByStream = async (req, res) => {
  try {
    const { streamId } = req.params;

    // Validate streamId if you want (optional)
    if (!streamId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid stream ID" });
    }

    const topics = await Topic.find({ stream: streamId });

    res.json(topics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// Update a topic
const updateTopic = async (req, res) => {
  const { error } = validateTopic(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    res.json({ message: "Topic updated successfully", topic });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete a topic
const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    res.json({ message: "Topic deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createTopic,
  getTopics,
  getTopicsByStream,
  updateTopic,
  deleteTopic
};
