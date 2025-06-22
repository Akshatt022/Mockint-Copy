
const express = require("express");
const router = express.Router();

// Example empty route
router.get("/tests", (req, res) => res.send("Test routes working"));

module.exports = router;
