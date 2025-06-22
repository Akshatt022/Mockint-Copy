const jwt = require("jsonwebtoken");
const { adminModel } = require("../models/admin");

const isAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if token is present
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if admin exists
    const admin = await adminModel.findById(decoded.id);
    if (!admin) {
      return res.status(403).json({ error: "Access denied. Invalid admin." });
    }

    // Attach admin to request and continue
    req.admin = admin;
    next();
  } catch (err) {
    return res.status(400).json({ error: "Invalid token." });
  }
};

module.exports = isAdmin;
