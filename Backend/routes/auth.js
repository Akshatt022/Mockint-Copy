const express = require("express");
const router = express.Router();
const { register,login,verifyToken} = require("../controllers/authcontrollers");
const authMiddleware = require("../middleware/authMiddleware");

// Route for registration
router.post("/register", register);
router.post("/login", login);
router.get("/verify", authMiddleware, verifyToken);

module.exports = router;
