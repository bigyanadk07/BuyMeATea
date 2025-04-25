// EsewaController.js (Node.js/Express example)
const express = require('express');
const router = express.Router();
const EsewaService = require('./EsewaService');
const PaymentModel = require('./PaymentModel');
const { v4: uuidv4 } = require('uuid');

// Configuration
const MERCHANT_ID = process.env.ESEWA_MERCHANT_ID;
const BASE_URL = process.env.APP_BASE_URL || 'http://localhost:3000';
const SUCCESS_URL = `${BASE_URL}/payment/success`;
const FAILURE_URL = `${BASE_URL}/payment/failure`;

// Initiate payment
router.post('/initiate', async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || isNaN(amount) || amount < 10) {
      return res.status(400).json({ error: 'Valid amount is required (minimum 10)' });
    }
    
    // Create a unique product ID for this transaction
    const productId = `TEA-${uuidv4()}`;
    
    // Calculate total amount (add service charge, tax if needed)
    const totalAmount = amount;
    
    // Store payment info in database
    const payment = await PaymentModel.create({
      productId,
      amount,
      totalAmount,
      status: 'INITIATED',
      userId: req.user?.id, // If you have user authentication
    });
    
    // Return payment parameters
    res.json({
      amount,
      totalAmount,
      productId,
      merchantId: MERCHANT_ID,
      successUrl: `${SUCCESS_URL}?oid=${productId}`,
      failureUrl: FAILURE_URL,
      serviceCharge: 0,
      taxAmount: 0,
      deliveryCharge: 0
    });
    
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ error: 'Failed to initiate payment' });
  }
});

// Verify payment
router.post('/verify', async (req, res) => {
  try {
    const { oid, amt, refId } = req.body;
    
    if (!oid || !amt || !refId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Verify with eSewa
    const verificationResult = await EsewaService.verifyPayment(oid, amt, refId);
    
    if (verificationResult.success) {
      // Update payment status in the database
      await PaymentModel.findOneAndUpdate(
        { productId: oid },
        { 
          status: 'COMPLETED', 
          transactionId: refId,
          verifiedAt: new Date()
        }
      );
      
      return res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      await PaymentModel.findOneAndUpdate(
        { productId: oid },
        { status: 'VERIFICATION_FAILED' }
      );
      
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
    
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

module.exports = router;