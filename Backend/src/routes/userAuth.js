const express = require('express');
const authRouter = express.Router();
const passport = require('passport');

// Import controller methods
const {
  register,
  login,
  logout,
  collegeLogin,
  collegeRegister,
  collegeLogout,
  googleAuthCallback
} = require('../controllers/userAuthent');

const userMiddleware = require('../middleware/userMiddleware');
const collegeMiddleware = require('../middleware/collegeMiddleware');

// User routes
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', userMiddleware, logout);

authRouter.get('/check', userMiddleware, (req, res) => {
  const reply = {
    firstName: req.result.firstName,
    emailId: req.result.emailId,
    _id: req.result._id,
    role: req.result.role
  }

  res.status(200).json({
    user: reply,
    message: "Valid user"
  })
})

// Google OAuth routes
authRouter.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

authRouter.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: true
  }),
  googleAuthCallback
);

// College routes
authRouter.post('/collegeAuth/register', collegeRegister);
authRouter.post('/collegeAuth/login', collegeLogin);
authRouter.post('/collegeAuth/logout', collegeMiddleware, collegeLogout);
authRouter.get('/collegeAuth/checkAuth', collegeMiddleware, (req, res) => {
  const reply = {
    collegeName: req.result.collegeName,
    emailId: req.result.emailId,
    _id: req.result._id,
  }

  res.status(200).json({
    college: reply,
    message: "Valid user"
  })
});

module.exports = authRouter;