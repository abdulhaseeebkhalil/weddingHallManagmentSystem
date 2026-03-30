const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  transactionNumber: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },

  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: [true, 'Account is required']
  },
  type: {
    type: String,
    enum: ['Debit', 'Credit'],
    required: [true, 'Transaction type is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required']
  },

  referenceType: {
    type: String,
    enum: ['Payment', 'Expense', 'Salary', 'Supplier', 'Manual']
  },
  referenceId: mongoose.Schema.Types.ObjectId,

  description: {
    type: String,
    required: [true, 'Description is required']
  },
  runningBalance: Number,

  enteredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', TransactionSchema);
