const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      return !this.oauthProvider;
    }
  },
  oauthProvider: {
    type: String,
    enum: ['google', 'github', 'linkedin'],
    default: null
  },
  oauthId: {
    type: String,
    default: null
  },
  avatarUrl: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    match: /^[6-9]\d{9}$/
  },
  addresses: [
    {
      address: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      pincode: {
        type: Number,
        required: true
      }
    }
  ],
  // Admin management fields
  isActive: {
    type: Boolean,
    default: true
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockoutUntil: {
    type: Date
  },
  completedTopics: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic'
  }]
}, { timestamps: true });

// Indexes for performance
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ phone: 1 });
UserSchema.index({ oauthProvider: 1, oauthId: 1 });
UserSchema.index({ createdAt: -1 });


// Joi validation schema
const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
      .message('Password must include uppercase, lowercase, number, and special character')
      .required(),
    phone: Joi.string()
      .pattern(/^[6-9]\d{9}$/)
      .message('Invalid phone number')
      .required(),
    addresses: Joi.array().items(
      Joi.object({
        address: Joi.string().required(),
        state: Joi.string().required(),
        city: Joi.string().required(),
        pincode: Joi.number().required()
      })
    ).required()
  });

  return schema.validate(user);
};

const User = mongoose.model("User", UserSchema);

module.exports = {
  User,
  validateUser
};
