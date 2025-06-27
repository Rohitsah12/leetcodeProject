const express = require('express');
const authRouter = express.Router();
const jwt = require('jsonwebtoken'); // ADDED
const { register, login, logout, adminRegister, deleteProfile, collegeLogin, collegeRegister, collegeLogout } = require('../controllers/userAuthent');
const userMiddleware = require('../middleware/userMiddleWare');
const passport = require('passport');
const collegeMiddleware = require('../middleware/collegeMiddleware');

// Existing routes
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', userMiddleware, logout);
authRouter.post('/admin/register', userMiddleware, adminRegister);
authRouter.delete('/deleteProfile', userMiddleware, deleteProfile);

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

// Google Authentication
authRouter.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google Callback - MODIFIED
// Modify the Google callback route
authRouter.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: true
  }),
  (req, res) => {
    // Generate JWT token
    const token = jwt.sign(
      {
        _id: req.user._id,
        emailId: req.user.emailId,
        role: req.user.role
      },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000 // 1 hour
    });

    res.redirect(`${process.env.FRONTEND_URL}`);
  }
);

authRouter.post('/collegeAuth/register',collegeRegister)
authRouter.post('/collegeAuth/login',collegeLogin)
authRouter.post('/collegeAuth/logout',collegeMiddleware,collegeLogout)
authRouter.get('/collegeAuth/checkAuth',collegeMiddleware,(req,res)=>{
  const reply = {
        collegeName: req.result.collegeName,
        emailId: req.result.emailId,
        _id: req.result._id,
    }

    res.status(200).json({
        college: reply,
        message: "Valid user"
    })
})


module.exports = authRouter;