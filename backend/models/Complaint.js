const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    name: String,
    type: String,
    size: Number,
    data: String,
  },
  { _id: false }
);

const complaintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    caseId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    status: {
      type: String,
      enum: ['Received', 'Pending', 'Solved'],
      default: 'Received',
    },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    date: { type: String, default: '' },
    files: { type: [fileSchema], default: [] },
    remarks: { type: String, default: '' },
    draftText: { type: String, default: '' },
    paymentId: { type: String, default: '' },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = mongoose.model('Complaint', complaintSchema);
