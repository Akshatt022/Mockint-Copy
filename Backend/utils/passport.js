const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models/User');

const hasGoogleConfig = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;
const backendPort = process.env.PORT || 5000;
const backendBaseUrl = process.env.BACKEND_URL || `http://localhost:${backendPort}`;
const googleCallbackUrl = process.env.GOOGLE_CALLBACK_URL || `${backendBaseUrl}/auth/google/callback`;

if (hasGoogleConfig) {
  passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: googleCallbackUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, emails, displayName, photos } = profile;
        const email = emails?.[0]?.value;
        let user = await User.findOne({ oauthProvider: 'google', oauthId: id });

        if (!user && email) {
          user = await User.findOne({ email });
          if (user) {
            user.oauthProvider = 'google';
            user.oauthId = id;
            user.avatarUrl = photos?.[0]?.value;
            await user.save();
          }
        }

        if (!user) {
          user = await User.create({
            name: displayName,
            email,
            oauthProvider: 'google',
            oauthId: id,
            avatarUrl: photos?.[0]?.value,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));
} else {
  console.warn('Google OAuth credentials are missing. Skipping GoogleStrategy setup.');
}

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.hasGoogleStrategy = hasGoogleConfig;

module.exports = passport;
