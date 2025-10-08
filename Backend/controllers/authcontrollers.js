const { User, validateUser } = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { sendSuccess, sendError, sendValidationError } = require('../utils/apiResponse');
const { asyncHandler } = require('../middleware/errorHandler');

const register = asyncHandler(async (req, res) => {
  // 1. Validate request body with Joi
  const { error } = validateUser(req.body);
  if (error) return sendValidationError(res, error);

  // 2. Check if user already exists
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) return sendError(res, "Email already registered", 409);

  // 3. Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

  // 4. Create new user document
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    phone: req.body.phone,
    addresses: req.body.addresses
  });

  // 5. Save user to DB
  await user.save();

  // 6. Respond success (exclude password in response)
  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone
  };

  return sendSuccess(res, userResponse, "User registered successfully", 201);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return sendError(res, "Email and password are required", 400);
  }

  const user = await User.findOne({ email });
  if (!user) {
    return sendError(res, "Invalid email or password", 401);
  }

  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) {
    return sendError(res, "Invalid email or password", 401);
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: 'user' },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone
  };

  return sendSuccess(res, { user: userResponse, token }, "Login successful");
});

const verifyToken = asyncHandler(async (req, res) => {
  // The authMiddleware already verified the token and attached user to req
  const user = await User.findById(req.user.id).select('-password');
  
  if (!user) {
    return sendError(res, 'User not found', 404);
  }

  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone
  };

  return sendSuccess(res, { user: userResponse }, 'Token is valid');
});

module.exports = {register,login,verifyToken};
