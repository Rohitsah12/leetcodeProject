const redisClient = require('../config/redis');
const College = require('../models/college');
const User = require('../models/user');
const validate = require('../utils/validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const collegeValidate = require('../utils/collegeValidator');

// Helper function for consistent cookie settings
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  // Remove domain setting for Render/Vercel setup
  domain: undefined // Don't set domain for cross-origin setup
});
const register = async (req, res) => {
  try {
    validate(req.body);
    const { firstName, emailId, password } = req.body;
    req.body.password = await bcrypt.hash(password, 10);
    req.body.role = 'user';

    const user = await User.create(req.body);
    const token = jwt.sign(
      { _id: user._id, emailId: emailId, role: 'user' },
      process.env.JWT_KEY,
      { expiresIn: '7d' }
    );

    const reply = {
      firstName: user.firstName,
      emailId: user.emailId,
      _id: user._id,
      role: user.role,
    };

    // Use consistent cookie options
    res.cookie('token', token, getCookieOptions());
    
    res.status(201).json({
      user: reply,
      message: "Registered successfully"
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      throw new Error("Email and password are required");
    }

    const user = await User.findOne({ emailId });
    if (!user) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    const reply = {
      firstName: user.firstName,
      emailId: user.emailId,
      _id: user._id,
      role: user.role,
    };
    
    const token = jwt.sign(
      { _id: user._id, emailId: emailId, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: '7d' }
    );

    // Use consistent cookie options
    res.cookie('token', token, getCookieOptions());
    
    res.status(200).json({
      user: reply,
      message: "Login successful"
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(200).send("Already logged out");

    const payload = jwt.decode(token);
    await redisClient.set(`token:${token}`, 'Blocked');
    await redisClient.expireAt(`token:${token}`, payload.exp);

    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined
    });
    res.status(200).send("Logged out successfully");
  } catch (error) {
    res.status(503).json({ error: error.message });
  }
};

const googleAuthCallback = (req, res) => {
  try {
    if (!req.user) throw new Error("Google authentication failed");

    const token = jwt.sign(
      {
        _id: req.user._id,
        emailId: req.user.emailId,
        role: req.user.role
      },
      process.env.JWT_KEY,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined
    });
res.cookie('token', token, getCookieOptions());
    req.logout((err) => {
      if (err) console.error('Session logout error:', err);
      
      res.redirect(`${process.env.FRONTEND_URL}`);

    });

  } catch (error) {
    console.error('Google auth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=${encodeURIComponent(error.message)}`);
  }
};


const collegeRegister = async (req, res) => {
  try {
    collegeValidate(req.body);
    const { collegeName, emailId, password } = req.body;
    req.body.password = await bcrypt.hash(password, 10);

    const college = await College.create(req.body);
    const token = jwt.sign(
      { _id: college._id, emailId: emailId },
      process.env.JWT_KEY,
      { expiresIn: '7d' }
    );

    const reply = {
      collegeName: college.collegeName,
      emailId: college.emailId,
      _id: college._id,
    };
    
    // Use consistent cookie options
    res.cookie('token', token, getCookieOptions());
    
    res.status(201).json({
      college: reply,
      message: "College registered successfully"
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const collegeLogin = async (req, res) => {
  try { 
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      throw new Error("Email and password are required");
    }

    const college = await College.findOne({ emailId });
    if (!college) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, college.password);
    if (!match) throw new Error("Invalid credentials");

    const reply = {
      collegeName: college.collegeName,
      emailId: college.emailId,
      _id: college._id,
    };
    
    const token = jwt.sign(
      { _id: college._id, emailId: emailId },
      process.env.JWT_KEY,
      { expiresIn: '7d' }
    );

    // Use consistent cookie options
    res.cookie('token', token, getCookieOptions());
    
    res.status(200).json({
      college: reply,
      message: "College login successful"
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const collegeLogout = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(200).send("Already logged out");

    const payload = jwt.decode(token);
    await redisClient.set(`token:${token}`, 'Blocked');
    await redisClient.expireAt(`token:${token}`, payload.exp);

    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined
    });
    res.status(200).send("College logged out successfully");
  } catch (error) {
    res.status(503).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  collegeRegister,
  collegeLogin,
  collegeLogout,
  googleAuthCallback
};
