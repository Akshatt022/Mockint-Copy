const {User} = require("../models/User");

const getProfile = (req, res) => {
  // req.user is set by verifyToken middleware
  res.json({
    message: "User profile data",
    user: req.user,
  });
};

const updateUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, phone },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ error: "Update failed", details: err.message });
  }
};


const bcrypt = require("bcryptjs");

const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: "Incorrect current password" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;

    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Password change failed", details: err.message });
  }
};


module.exports = {
  getProfile,
  updateUser,
  changePassword,
};