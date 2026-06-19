const User = require('../models/User');
const { formatUserResponse } = require('./authController');

exports.getAllUsers = async (req, res, next) => {
  try {
    const { search } = req.query;
    const filter = { role: 'user' };

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ name: regex }, { email: regex }, { phone: regex }, { city: regex }];
    }

    const users = await User.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users: users.map(formatUserResponse),
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { name, fname, lname, email, phone, city, blocked } = req.body;
    const user = await User.findById(req.params.id);

    if (!user || user.role === 'admin') {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (name || fname || lname) {
      user.name = name || [fname, lname].filter(Boolean).join(' ').trim();
    }
    if (email) user.email = email.toLowerCase();
    if (phone) user.phone = phone;
    if (city !== undefined) user.city = city;
    if (blocked !== undefined) user.blocked = blocked;

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully.',
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

exports.toggleBlockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || user.role === 'admin') {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.blocked = !user.blocked;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.blocked ? 'blocked' : 'unblocked'} successfully.`,
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || user.role === 'admin') {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
