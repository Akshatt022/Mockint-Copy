// Environment Configuration
const config = {
  development: {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
    DEBUG: true,
    LOG_LEVEL: 'debug'
  },
  production: {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://your-api-domain.com',
    DEBUG: false,
    LOG_LEVEL: 'error'
  },
  staging: {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://staging-api-domain.com',
    DEBUG: true,
    LOG_LEVEL: 'warn'
  }
};

const environment = import.meta.env.MODE || 'development';

export const ENV_CONFIG = config[environment] || config.development;

export const isProduction = environment === 'production';
export const isDevelopment = environment === 'development';
export const isStaging = environment === 'staging';

// Feature flags
export const FEATURES = {
  ADMIN_MODE: import.meta.env.VITE_ADMIN_MODE === 'true',
  DEBUG_MODE: isDevelopment || import.meta.env.VITE_DEBUG === 'true',
  ANALYTICS: isProduction,
  ERROR_REPORTING: isProduction || isStaging
};

export default ENV_CONFIG;