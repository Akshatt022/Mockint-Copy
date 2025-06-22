const { User, validateUser } = require('../models/User'); // Assuming your User model exports validateUser for Joi
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");  
const router = require('../routes/user');

const register = async (req, res) => {
  // 1. Validate request body with Joi
  const { error } = validateUser(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    // 2. Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) return res.status(409).json({ error: "Email already registered" });

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

    // 6. Respond success (you can exclude password in response)
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) {
    console.log("User not found");
    return res.status(400).json({ message: 'Invalid email or password' });
    } 

    const validPass = await bcrypt.compare(password, user.password);
    
    if (!validPass)
      return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({ message: "Login successful", token });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {register,login};
