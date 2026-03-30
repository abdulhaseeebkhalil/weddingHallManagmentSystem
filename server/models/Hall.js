const mongoose = require('mongoose');

const HallSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hall name is required'],
    unique: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required']
  },
  description: {
    type: String,
    trim: true
  },
  amenities: [String],
  basePrice: {
    type: Number,
    required: [true, 'Base price is required']
  },
  images: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Hall', HallSchema);
