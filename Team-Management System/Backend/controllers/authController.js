const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token containing userId and role
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error('GetMe error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Fetch the current user from DB (with password field for comparison)
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update name if provided
    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Name cannot be empty',
        });
      }
      user.name = name.trim();
    }

    // Update email if provided
    if (email !== undefined) {
      const normalizedEmail = email.toLowerCase().trim();
      if (!normalizedEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email cannot be empty',
        });
      }

      // Validate email format
      if (!/\S+@\S+\.+/.test(normalizedEmail)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address',
        });
      }

      // Check if new email is already used by another user
      const emailExists = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });

      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: 'This email is already in use',
        });
      }

      user.email = normalizedEmail;
    }

    // Update password if provided
    if (password !== undefined) {
      if (!password || password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters',
        });
      }
      user.password = password; // pre('save') hook will hash it
    }

    // Explicitly block any attempt to change role
    delete req.body.role;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('UpdateProfile error:', error.message);
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This email is already in use',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
    });
  }
};

module.exports = { login, getMe, updateProfile };
