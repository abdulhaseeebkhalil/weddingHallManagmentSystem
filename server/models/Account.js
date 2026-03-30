const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  accountCode: {
    type: String,
    required: [true, 'Account code is required'],
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Account name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'],
    required: [true, 'Account type is required']
  },
  category: String,
  description: String,
  openingBalance: {
    type: Number,
    default: 0
  },
  currentBalance: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Account', AccountSchema);
