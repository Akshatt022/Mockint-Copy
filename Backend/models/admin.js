const mongoose = require('mongoose');
const Joi = require('joi');

const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
  type: String,
  enum: ['admin', 'superadmin'],
  default: 'admin',
},

    
}, { timestamps: true });

const adminJoiSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .required(),
    
    email: Joi.string()
        .email()
        .required(),
    
    password: Joi.string()
        .min(8)
        .required(),

    role: Joi.string().valid('admin', 'superadmin')

});

const validateAdmin = (admin) => {
    return adminJoiSchema.validate(admin);
};

const adminModel = mongoose.model('admin', AdminSchema);

module.exports = {
    adminModel,
    validateAdmin
};