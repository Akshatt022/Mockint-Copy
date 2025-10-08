const express = require("express");
const router = express.Router();
const { register,login,verifyToken} = require("../controllers/authcontrollers");
const authMiddleware = require("../middleware/authMiddleware");
const passport = require('../utils/passport');
const jwt = require("jsonwebtoken");
const rateLimit = require('express-rate-limit');

const buildSuccessUrl = (hint, fallbackBase) => {
  const fallback = new URL('oauth-success', fallbackBase.endsWith('/') ? fallbackBase : `${fallbackBase}/`);
  if (!hint) {
    return fallback;
  }
  try {
    const url = new URL(hint);
    if (!url.pathname || url.pathname === '/') {
      url.pathname = '/oauth-success';
    }
    return url;
  } catch (error) {
    console.warn('Invalid OAuth redirect hint:', hint, error.message);
    return fallback;
  }
};

const buildErrorUrl = (successUrl) => {
  const url = new URL(successUrl.toString());
  url.pathname = '/oauth-error';
  url.search = '';
  return url;
};

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many authentication attempts, please try again later.',
});

if (passport.hasGoogleStrategy) {
  router.get('/google', (req, res, next) => {
    const { redirect } = req.query;
    if (redirect) {
      try {
        req.session.oauthSuccessRedirect = decodeURIComponent(redirect);
      } catch (error) {
        req.session.oauthSuccessRedirect = redirect;
      }
    }

    const authOptions = {
      scope: ['profile', 'email'],
      prompt: 'select_account',
      accessType: 'offline',
    };

    passport.authenticate('google', authOptions)(req, res, next);
  });

  router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
      const redirectHint = req.session?.oauthSuccessRedirect;
      if (req.session) {
        delete req.session.oauthSuccessRedirect;
      }

      const fallbackBase = process.env.FRONTEND_URL || 'http://localhost:3000';
      const successUrl = buildSuccessUrl(redirectHint, fallbackBase);
      const errorUrl = buildErrorUrl(successUrl);

      if (err) {
        console.error('Google OAuth callback error:', err);
        if (err && err.data) {
          console.error('Google error response:', err.data);
        }
        errorUrl.searchParams.set('message', err.message || 'OAuth error');
        return res.redirect(errorUrl.toString());
      }

      if (!user) {
        const failureMessage = info?.message || 'Unable to authenticate with Google';
        errorUrl.searchParams.set('message', failureMessage);
        return res.redirect(errorUrl.toString());
      }

      const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
      successUrl.searchParams.set('token', token);
      return res.redirect(successUrl.toString());
    })(req, res, next);
  });
} else {
  router.get('/google', (req, res) => {
    res.status(503).json({
      error: 'Google OAuth is not configured. Please contact the administrator.',
    });
  });

  router.get('/google/callback', (req, res) => {
    res.status(503).json({
      error: 'Google OAuth is not configured. Please contact the administrator.',
    });
  });
}

// Route for registration
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/verify", authMiddleware, verifyToken);

module.exports = router;
