const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const formatUserResponse = (user) => {
  const nameParts = (user.name || '').trim().split(/\s+/);
  const fname = nameParts[0] || '';
  const lname = nameParts.slice(1).join(' ') || '';

  return {
    id: user._id.toString(),
    _id: user._id.toString(),
    name: user.name,
    fname,
    lname,
    email: user.email,
    phone: user.phone,
    role: user.role,
    city: user.city || '',
    blocked: user.blocked || false,
    createdAt: user.createdAt,
  };
};

exports.register = async (req, res, next) => {
  try {
    const { name, fname, lname, email, phone, password, city } = req.body;
    const fullName = name || [fname, lname].filter(Boolean).join(' ').trim();

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Account with this email already exists.' });
    }

    const user = await User.create({
      name: fullName,
      email: email.toLowerCase(),
      phone,
      password,
      city: city || '',
      role: 'user',
    });

    const token = signToken(user._id);
    const userData = formatUserResponse(user);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: userData,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (user.blocked) {
      return res.status(403).json({ success: false, message: 'Your account has been blocked.' });
    }

    const token = signToken(user._id);
    const userData = formatUserResponse(user);

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: userData,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res) => {
  res.json({
    success: true,
    user: formatUserResponse(req.user),
  });
};

exports.formatUserResponse = formatUserResponse;
