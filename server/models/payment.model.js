// PaymentModel.js (Example using Mongoose with MongoDB)
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional if you want to track anonymous payments
  },
  amount: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['INITIATED', 'COMPLETED', 'FAILED', 'VERIFICATION_FAILED'],
    default: 'INITIATED'
  },
  transactionId: {
    type: String,
    sparse: true // Only enforce uniqueness if field exists
  },
  description: {
    type: String,
    default: 'Buy Me a Tea Donation'
  },
  metadata: {
    type: Object,
    default: {}
  },
  verifiedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the timestamp before saving
paymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;