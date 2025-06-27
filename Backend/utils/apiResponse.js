// Standardized API Response Utilities

/**
 * Success response wrapper
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 */
const successResponse = (data = null, message = 'Success', statusCode = 200) => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
    statusCode
  };
};

/**
 * Error response wrapper
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {*} errors - Additional error details
 */
const errorResponse = (message = 'Internal Server Error', statusCode = 500, errors = null) => {
  return {
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString(),
    statusCode
  };
};

/**
 * Validation error response
 * @param {*} validationErrors - Joi validation errors
 */
const validationErrorResponse = (validationErrors) => {
  const errors = validationErrors.details?.map(detail => ({
    field: detail.path.join('.'),
    message: detail.message
  })) || [];

  return errorResponse('Validation failed', 400, errors);
};

/**
 * Paginated response wrapper
 * @param {*} data - Array of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items count
 * @param {string} message - Success message
 */
const paginatedResponse = (data, page, limit, total, message = 'Data retrieved successfully') => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    success: true,
    message,
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? page + 1 : null,
      prevPage: hasPrevPage ? page - 1 : null
    },
    timestamp: new Date().toISOString(),
    statusCode: 200
  };
};

/**
 * Send success response
 * @param {*} res - Express response object
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 */
const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = successResponse(data, message, statusCode);
  return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {*} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {*} errors - Additional error details
 */
const sendError = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
  const response = errorResponse(message, statusCode, errors);
  return res.status(statusCode).json(response);
};

/**
 * Send validation error response
 * @param {*} res - Express response object
 * @param {*} validationErrors - Joi validation errors
 */
const sendValidationError = (res, validationErrors) => {
  const response = validationErrorResponse(validationErrors);
  return res.status(400).json(response);
};

/**
 * Send paginated response
 * @param {*} res - Express response object
 * @param {*} data - Array of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items count
 * @param {string} message - Success message
 */
const sendPaginatedResponse = (res, data, page, limit, total, message = 'Data retrieved successfully') => {
  const response = paginatedResponse(data, page, limit, total, message);
  return res.status(200).json(response);
};

module.exports = {
  successResponse,
  errorResponse,
  validationErrorResponse,
  paginatedResponse,
  sendSuccess,
  sendError,
  sendValidationError,
  sendPaginatedResponse
};