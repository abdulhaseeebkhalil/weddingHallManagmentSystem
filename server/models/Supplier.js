const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Supplier name is required'],
    trim: true
  },
  contactPerson: String,
  phone: {
    type: String,
    required: [true, 'Phone is required']
  },
  email: String,
  address: String,
  category: String,

  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  totalPayable: {
    type: Number,
    default: 0
  },
  totalPaid: {
    type: Number,
    default: 0
  },
  balance: {
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

module.exports = mongoose.model('Supplier', SupplierSchema);
