const mongoose = require('mongoose');

const KitchenIssueSchema = new mongoose.Schema({
  issueNumber: {
    type: String,
    required: true,
    unique: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },

  items: [{
    ingredient: String,
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }
  }],

  issuedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  status: {
    type: String,
    enum: ['Pending', 'Issued', 'Completed'],
    default: 'Pending'
  },
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('KitchenIssue', KitchenIssueSchema);
