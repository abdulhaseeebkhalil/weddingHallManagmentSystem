const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Menu item name is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Appetizer', 'Main Course', 'Rice', 'Bread', 'Dessert', 'Beverage', 'Salad', 'Soup', 'Other'],
    required: [true, 'Category is required']
  },
  description: String,
  costPerServing: Number,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);
