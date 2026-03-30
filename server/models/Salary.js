const mongoose = require('mongoose');

const SalarySchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },

  baseSalary: { type: Number, required: true },
  allowances: { type: Number, default: 0 },

  totalWorkingDays: { type: Number, required: true },
  daysPresent: { type: Number, required: true },
  daysAbsent: { type: Number, default: 0 },
  absentDeduction: { type: Number, default: 0 },
  loanDeduction: { type: Number, default: 0 },
  advanceDeduction: { type: Number, default: 0 },
  otherDeductions: { type: Number, default: 0 },

  totalDeductions: { type: Number, default: 0 },
  netSalary: { type: Number, required: true },

  status: {
    type: String,
    enum: ['Generated', 'Approved', 'Paid'],
    default: 'Generated'
  },
  paidDate: Date,
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  notes: String
}, {
  timestamps: true
});

SalarySchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Salary', SalarySchema);
