const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },

  lineItems: [{
    description: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, required: true },
    total: { type: Number, required: true }
  }],

  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  discountType: { type: String, enum: ['percentage', 'fixed'], default: 'fixed' },
  taxRate: { type: Number, default: 16 },
  taxAmount: { type: Number, default: 0 },
  serviceCharges: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },

  amountPaid: { type: Number, default: 0 },
  balanceDue: { type: Number },

  status: {
    type: String,
    enum: ['Draft', 'Issued', 'Paid', 'Overdue', 'Cancelled'],
    default: 'Draft'
  },
  issueDate: { type: Date, default: Date.now },
  dueDate: Date,

  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
