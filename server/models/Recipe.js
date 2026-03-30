const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  ingredients: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: {
      type: String,
      enum: ['KG', 'Gram', 'Litre', 'ML', 'Piece', 'Dozen'],
      required: true
    },
    costPerUnit: Number
  }],
  servingsPerBatch: {
    type: Number,
    required: true
  },
  instructions: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Recipe', RecipeSchema);
