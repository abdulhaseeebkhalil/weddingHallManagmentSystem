const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  bookingNumber: {
    type: String,
    required: true,
    unique: true
  },
  hall: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hall',
    required: [true, 'Hall is required']
  },

  // Client Info
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true
  },
  clientPhone: {
    type: String,
    required: [true, 'Client phone is required']
  },
  clientCNIC: String,
  clientAddress: String,

  // Event Details
  eventDate: {
    type: Date,
    required: [true, 'Event date is required']
  },
  timeSlot: {
    type: String,
    enum: ['Lunch', 'Dinner', 'Custom'],
    required: [true, 'Time slot is required']
  },
  customTimeStart: String,
  customTimeEnd: String,
  functionType: {
    type: String,
    enum: ['Walima', 'Mehndi', 'Barat', 'Reception', 'Birthday', 'Corporate', 'Engagement', 'Other'],
    required: [true, 'Function type is required']
  },
  guestCount: {
    type: Number,
    required: [true, 'Guest count is required']
  },

  // Financial
  hallCharges: {
    type: Number,
    required: [true, 'Hall charges are required']
  },
  additionalCharges: [{
    description: String,
    amount: Number
  }],
  discount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  advanceAmount: {
    type: Number,
    default: 0
  },
  remainingBalance: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Partial', 'Pending'],
    default: 'Pending'
  },

  // Status
  status: {
    type: String,
    enum: ['Confirmed', 'Tentative', 'Postponed', 'Cancelled'],
    default: 'Tentative'
  },

  // Menu
  selectedMenu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu'
  },
  specialInstructions: String,

  // Tracking
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: String
}, {
  timestamps: true
});

// Auto-calculate remaining balance before save
BookingSchema.pre('save', function(next) {
  this.remainingBalance = this.totalAmount - this.advanceAmount;
  if (this.remainingBalance <= 0) {
    this.paymentStatus = 'Paid';
  } else if (this.advanceAmount > 0) {
    this.paymentStatus = 'Partial';
  } else {
    this.paymentStatus = 'Pending';
  }
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);
