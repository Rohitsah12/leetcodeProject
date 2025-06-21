const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
const jwt = require('jsonwebtoken'); // ADDED

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/user/google/callback',
    scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Find user by Google ID or email
        let user = await User.findOne({
            $or: [
                { googleId: profile.id },
                { emailId: profile.emails[0].value }
            ]
        });

        if (user) {
            // Update existing user with Google ID if missing
            if (!user.googleId) {
                user.googleId = profile.id;
                user.isVerified = true;
                await user.save();
            }
            return done(null, user);
        }

        // Create new user
        const nameParts = profile.displayName.split(' ');
        const newUser = new User({
            googleId: profile.id,
            emailId: profile.emails[0].value,
            firstName: nameParts[0] || 'Google',
            lastName: nameParts.slice(1).join(' ') || 'User',
            isVerified: true,
            role: 'user'
        });

        await newUser.save();
        return done(null, newUser);
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});