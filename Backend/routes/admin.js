const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { adminModel } = require("../models/admin");
require("dotenv").config();

// Development-only route to create a default admin
if (process.env.NODE_ENV === "development") {
  router.get("/create", async (req, res) => {
    try {
      const existingAdmin = await adminModel.findOne({ email: "admin@blink.com" });
      if (existingAdmin) return res.status(400).send("Admin already exists.");

      const hash = await bcrypt.hash("admin", 10);
      const admin = new adminModel({
        name: "Akshat Singh",
        email: "admin@mockint.com",
        password: hash,
        role: "superadmin",
      });

      await admin.save();
      const token = jwt.sign({ email: admin.email, admin: true }, process.env.JWT_SECRET);
      res.cookie("token", token);
      res.send("Admin Created Successfully");
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });
}

// Admin login view
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const admin = await adminModel.findOne({ email });
  if (!admin) return res.status(400).json({ error: "Admin not found" });

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) return res.status(401).json({ error: "Invalid password" });

  const token = jwt.sign({ email: admin.email, admin: true }, process.env.JWT_SECRET);
  res.status(200).json({ token, name: admin.name });
});




module.exports = router;
