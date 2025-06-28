const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const { getProfile,updateUser,changePassword} = require("../controllers/usercontroller");

// Example empty route to avoid errors
router.get("/profile", verifyToken, getProfile);
router.put("/update", verifyToken, updateUser);
router.put("/change-password", verifyToken, changePassword);

module.exports = router;