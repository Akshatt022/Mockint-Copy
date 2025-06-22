const express = require("express");
const router = express.Router();
const {
  createTopic,
  getTopics,
  getTopicsByStream,
  updateTopic,
  deleteTopic
} = require("../controllers/topiccontroller");

router.post("/", createTopic);
router.get("/", getTopics);
router.get("/:id",getTopicsByStream)
router.put("/:id", updateTopic);
router.delete("/:id", deleteTopic);

module.exports = router;
