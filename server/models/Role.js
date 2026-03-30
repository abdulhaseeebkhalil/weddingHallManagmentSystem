const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Role name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  permissions: [{
    module: {
      type: String,
      enum: ['dashboard', 'bookings', 'events', 'accounts', 'expenses', 'hr', 'kitchen', 'settings'],
      required: true
    },
    access: {
      type: String,
      enum: ['none', 'read', 'full'],
      default: 'none'
    }
  }],
  isSystem: {
    type: Boolean,
    default: false  // system roles (Admin) can't be deleted
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Role', RoleSchema);
