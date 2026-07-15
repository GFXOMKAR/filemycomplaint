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

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'PLACEHOLDER_EMAIL@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || 'PLACEHOLDER_APP_PASSWORD',
  },
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.sendOtp = async (req, res, next) => {
  try {
    const { email, isSignup, name, fname, lname, phone, city } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const emailLower = email.toLowerCase();
    let user = await User.findOne({ email: emailLower });

    if (isSignup && user) {
      return res.status(400).json({ success: false, message: 'Account with this email already exists.' });
    }

    if (!isSignup && !user) {
      return res.status(404).json({ success: false, message: 'Account not found. Please sign up first.' });
    }

    if (user && user.blocked) {
      return res.status(403).json({ success: false, message: 'Your account has been blocked.' });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (isSignup) {
      const fullName = name || [fname, lname].filter(Boolean).join(' ').trim();
      if (!fullName || !phone) {
        return res.status(400).json({ success: false, message: 'Name and phone are required for signup.' });
      }
      user = await User.create({
        name: fullName,
        email: emailLower,
        phone,
        city: city || '',
        role: 'user',
        otp,
        otpExpires,
      });
    } else {
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
    }

    const mailOptions = {
      from: `"File My Complaint" <${process.env.GMAIL_USER || 'PLACEHOLDER_EMAIL@gmail.com'}>`,
      to: emailLower,
      subject: 'Your Login OTP - File My Complaint',
      text: `Your One-Time Password (OTP) is: ${otp}. It is valid for 10 minutes.`,
      html: `<h3>Welcome to File My Complaint</h3><p>Your One-Time Password (OTP) is: <strong>${otp}</strong></p><p>It is valid for 10 minutes. Do not share this with anyone.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your email.',
    });
  } catch (error) {
    console.error('OTP Send Error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP. Please check email credentials.' });
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+otp +otpExpires');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.blocked) {
      return res.status(403).json({ success: false, message: 'Your account has been blocked.' });
    }

    if (user.otp !== otp) {
      return res.status(401).json({ success: false, message: 'Invalid OTP.' });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(401).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = signToken(user._id);
    const userData = formatUserResponse(user);

    res.status(200).json({
      success: true,
      message: 'Authentication successful.',
      token,
      user: userData,
    });
  } catch (error) {
    console.error('OTP Verify Error:', error);
    res.status(500).json({ success: false, message: 'Server error during verification.' });
  }
};

exports.getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.status(200).json({
      success: true,
      user: formatUserResponse(req.user),
    });
  } catch (error) {
    console.error('Get Me Error:', error);
    res.status(500).json({ success: false, message: 'Server error during fetching current user.' });
  }
};

exports.formatUserResponse = formatUserResponse;

