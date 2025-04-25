// PaymentComponent.tsx
import React, { useState } from 'react';
import { initiatePayment } from '../service/PaymentService';

interface PaymentDetails {
  amount: number;
  serviceCharge?: number;
  deliveryCharge?: number;
  taxAmount?: number;
  totalAmount: number;
  productId: string;
  merchantId: string;
  successUrl: string;
  failureUrl: string;
}

const PaymentComponent: React.FC = () => {
  const [amount, setAmount] = useState<number>(100); // Default amount (e.g., 100 NPR)
  const [loading, setLoading] = useState<boolean>(false);
  
  const handlePayment = async () => {
    try {
      setLoading(true);

      // Get payment details from the backend
      const paymentDetails: PaymentDetails = await initiatePayment(amount);

      // Create a hidden form to submit to eSewa
      const form = document.createElement('form');
      form.setAttribute('method', 'POST');
      form.setAttribute('action', 'https://uat.esewa.com.np/epay/main'); // Use https://esewa.com.np/epay/main for production

      // Add payment parameters
      const params: { [key: string]: string | number } = {
        amt: paymentDetails.amount,
        psc: paymentDetails.serviceCharge ?? 0,
        pdc: paymentDetails.deliveryCharge ?? 0,
        txAmt: paymentDetails.taxAmount ?? 0,
        tAmt: paymentDetails.totalAmount,
        pid: paymentDetails.productId,
        scd: paymentDetails.merchantId,
        su: paymentDetails.successUrl,
        fu: paymentDetails.failureUrl
      };

      // Create input fields for the form
      Object.entries(params).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', key);
        input.setAttribute('value', String(value));
        form.appendChild(input);
      });

      // Append form to body and submit
      document.body.appendChild(form);
      form.submit();

    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <h2>Buy Me a Tea</h2>
      <div className="amount-input">
        <label>Amount (NPR)</label>
        <input 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(parseInt(e.target.value, 10))} 
          min={10}
        />
      </div>
      <button 
        onClick={handlePayment} 
        disabled={loading}
        className="pay-button"
      >
        {loading ? 'Processing...' : 'Pay with eSewa'}
      </button>
    </div>
  );
};

export default PaymentComponent;
