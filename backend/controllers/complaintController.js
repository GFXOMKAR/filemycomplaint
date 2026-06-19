const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { formatUserResponse } = require('./authController');

const generateCaseId = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9000 + 1000);
  return `FTC-${year}-${random}`;
};

const formatComplaintResponse = (complaint) => ({
  _id: complaint._id.toString(),
  id: complaint._id.toString(),
  userId: complaint.userId ? complaint.userId.toString() : null,
  caseId: complaint.caseId,
  name: complaint.name,
  phone: complaint.phone,
  email: complaint.email || '',
  category: complaint.category,
  subject: complaint.subject,
  against: complaint.subject,
  description: complaint.description,
  issueDescription: complaint.description,
  status: complaint.status,
  city: complaint.city || '',
  state: complaint.state || '',
  date: complaint.date || '',
  files: complaint.files || [],
  remarks: complaint.remarks || '',
  draftText: complaint.draftText || '',
  paymentId: complaint.paymentId || '',
  createdAt: complaint.createdAt,
  submittedAt: complaint.createdAt,
});

exports.createComplaint = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      email,
      category,
      subject,
      against,
      description,
      issueDescription,
      city,
      state,
      date,
      files,
      paymentId,
    } = req.body;

    const complaintSubject = subject || against;
    const complaintDescription = description || issueDescription;

    if (!name || !phone || !category || !complaintSubject || !complaintDescription) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, category, subject, and description are required.',
      });
    }

    let caseId = generateCaseId();
    let exists = await Complaint.findOne({ caseId });
    while (exists) {
      caseId = generateCaseId();
      exists = await Complaint.findOne({ caseId });
    }

    const complaint = await Complaint.create({
      userId: req.user._id,
      caseId,
      name,
      phone,
      email: email || req.user.email,
      category,
      subject: complaintSubject,
      description: complaintDescription,
      city: city || '',
      state: state || '',
      date: date || '',
      files: files || [],
      paymentId: paymentId || `FREE_${Date.now()}`,
      status: 'Received',
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully.',
      complaint: formatComplaintResponse(complaint),
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyComplaints = async (req, res, next) => {
  try {
    const { search, status, sort = 'desc' } = req.query;
    const filter = { userId: req.user._id };

    if (status) {
      filter.status = new RegExp(`^${status}$`, 'i');
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { caseId: regex },
        { name: regex },
        { category: regex },
        { subject: regex },
        { description: regex },
      ];
    }

    const sortOrder = sort === 'asc' ? 1 : -1;
    const complaints = await Complaint.find(filter).sort({ createdAt: sortOrder });

    res.json({
      success: true,
      count: complaints.length,
      complaints: complaints.map(formatComplaintResponse),
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllComplaints = async (req, res, next) => {
  try {
    const { search, status, category, sort = 'desc' } = req.query;
    const filter = {};

    if (status) {
      filter.status = new RegExp(`^${status}$`, 'i');
    }

    if (category) {
      filter.category = category;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { caseId: regex },
        { name: regex },
        { phone: regex },
        { email: regex },
        { category: regex },
        { subject: regex },
        { description: regex },
      ];
    }

    const sortOrder = sort === 'asc' ? 1 : -1;
    const complaints = await Complaint.find(filter).sort({ createdAt: sortOrder });

    res.json({
      success: true,
      count: complaints.length,
      complaints: complaints.map(formatComplaintResponse),
    });
  } catch (error) {
    next(error);
  }
};

exports.getComplaintByCaseId = async (req, res, next) => {
  try {
    const complaint = await Complaint.findOne({ caseId: req.params.caseId });

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    if (req.user.role !== 'admin' && complaint.userId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.json({
      success: true,
      complaint: formatComplaintResponse(complaint),
    });
  } catch (error) {
    next(error);
  }
};

exports.updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, remarks, draftText } = req.body;
    const complaint = await Complaint.findOne({ caseId: req.params.caseId });

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    if (status) complaint.status = status;
    if (remarks !== undefined) complaint.remarks = remarks;
    if (draftText !== undefined) complaint.draftText = draftText;

    await complaint.save();

    res.json({
      success: true,
      message: 'Complaint updated successfully.',
      complaint: formatComplaintResponse(complaint),
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findOneAndDelete({ caseId: req.params.caseId });

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    res.json({
      success: true,
      message: 'Complaint deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

exports.createAdminComplaint = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      email,
      category,
      subject,
      against,
      description,
      issueDescription,
      city,
      state,
      date,
    } = req.body;

    const complaintSubject = subject || against;
    const complaintDescription = description || issueDescription;

    if (!name || !phone || !category || !complaintSubject || !complaintDescription) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, category, subject, and description are required.',
      });
    }

    let caseId = generateCaseId();
    let exists = await Complaint.findOne({ caseId });
    while (exists) {
      caseId = generateCaseId();
      exists = await Complaint.findOne({ caseId });
    }

    const complaint = await Complaint.create({
      userId: null,
      caseId,
      name,
      phone,
      email: email || '',
      category,
      subject: complaintSubject,
      description: complaintDescription,
      city: city || '',
      state: state || '',
      date: date || '',
      status: 'Received',
    });

    res.status(201).json({
      success: true,
      message: 'Complaint created successfully.',
      complaint: formatComplaintResponse(complaint),
    });
  } catch (error) {
    next(error);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({});
    const users = await User.find({ role: 'user' });

    const totalComplaints = complaints.length;
    const newComplaints = complaints.filter(
      (c) => !c.status || c.status.toLowerCase() === 'received'
    ).length;
    const pendingComplaints = complaints.filter(
      (c) => c.status && c.status.toLowerCase() === 'pending'
    ).length;
    const solvedComplaints = complaints.filter(
      (c) => c.status && c.status.toLowerCase() === 'solved'
    ).length;

    res.json({
      success: true,
      stats: {
        totalComplaints,
        newComplaints,
        pendingComplaints,
        solvedComplaints,
        totalUsers: users.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getPublicStats = async (req, res, next) => {
  try {
    const total = await Complaint.countDocuments();
    const solved = await Complaint.countDocuments({ status: 'Solved' });
    const pending = await Complaint.countDocuments({ status: 'Pending' });
    const received = await Complaint.countDocuments({ status: 'Received' });

    let successRate = 0;
    if (total > 0) {
      successRate = Math.round((solved * 100 + pending * 80 + received * 94) / total);
    }

    res.json({
      success: true,
      stats: {
        totalComplaints: total,
        successRate,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.formatComplaintResponse = formatComplaintResponse;
