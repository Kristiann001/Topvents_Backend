const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [{
    item: { type: Object, required: true },
    type: { type: String, enum: ['Event', 'Getaway', 'Stay'], required: true },
    quantity: { type: Number, default: 1 },
  }],
  phone: { type: String, required: true },
  amount: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: 'pending' },
  mpesaResponse: { type: Object },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);