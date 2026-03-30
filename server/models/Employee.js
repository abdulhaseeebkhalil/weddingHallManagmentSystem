const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  fatherName: String,
  cnic: {
    type: String,
    unique: true,
    sparse: true
  },
  phone: String,
  address: String,
  dateOfBirth: Date,
  dateOfJoining: {
    type: Date,
    required: [true, 'Date of joining is required']
  },

  department: {
    type: String,
    required: [true, 'Department is required']
  },
  designation: String,

  baseSalary: {
    type: Number,
    required: [true, 'Base salary is required']
  },
  allowances: {
    type: Number,
    default: 0
  },

  barcodeId: {
    type: String,
    unique: true,
    sparse: true
  },

  loanBalance: {
    type: Number,
    default: 0
  },
  advanceSalaryBalance: {
    type: Number,
    default: 0
  },
  monthlyLoanDeduction: {
    type: Number,
    default: 0
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  isActive: {
    type: Boolean,
    default: true
  },
  photo: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Employee', EmployeeSchema);
