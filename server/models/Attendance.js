const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  date: {
    type: Date,
    required: true
  },

  status: {
    type: String,
    enum: ['Present', 'Absent', 'Half-Day', 'Leave', 'Holiday'],
    required: [true, 'Status is required']
  },
  checkIn: String,
  checkOut: String,

  method: {
    type: String,
    enum: ['Barcode', 'Manual'],
    default: 'Manual'
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  notes: String
}, {
  timestamps: true
});

AttendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
