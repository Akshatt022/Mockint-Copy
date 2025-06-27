const Joi = require('joi');
const validator = require('validator');

// Validate ObjectId format
const validateObjectId = (id) => {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  return objectIdPattern.test(id);
};

// Validate pagination parameters
const validatePagination = (req, res, next) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).max(1000).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
  });

  const { error, value } = schema.validate({
    page: req.query.page,
    limit: req.query.limit
  });

  if (error) {
    return res.status(400).json({ 
      error: 'Invalid pagination parameters',
      details: error.details[0].message 
    });
  }

  req.pagination = value;
  next();
};

// Validate ObjectId parameters
const validateObjectIdParam = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!id || !validateObjectId(id)) {
      return res.status(400).json({ 
        error: `Invalid ${paramName} format` 
      });
    }
    next();
  };
};

// Validate query filters
const validateQueryFilters = (req, res, next) => {
  const allowedFilters = ['stream', 'subject', 'topic', 'difficulty', 'isActive'];
  const filters = {};

  for (const [key, value] of Object.entries(req.query)) {
    if (allowedFilters.includes(key)) {
      // Validate ObjectId fields
      if (['stream', 'subject', 'topic'].includes(key)) {
        if (!validateObjectId(value)) {
          return res.status(400).json({ 
            error: `Invalid ${key} ID format` 
          });
        }
      }
      
      // Validate enum fields
      if (key === 'difficulty' && !['Easy', 'Medium', 'Hard'].includes(value)) {
        return res.status(400).json({ 
          error: 'Invalid difficulty value' 
        });
      }
      
      // Validate boolean fields
      if (key === 'isActive' && !['true', 'false'].includes(value.toLowerCase())) {
        return res.status(400).json({ 
          error: 'Invalid isActive value' 
        });
      }
      
      filters[key] = value;
    }
  }

  req.filters = filters;
  next();
};

// Sanitize HTML input
const sanitizeHtml = (req, res, next) => {
  const sanitize = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = validator.escape(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };

  if (req.body) {
    sanitize(req.body);
  }
  
  next();
};

module.exports = {
  validatePagination,
  validateObjectIdParam,
  validateQueryFilters,
  sanitizeHtml,
  validateObjectId
};