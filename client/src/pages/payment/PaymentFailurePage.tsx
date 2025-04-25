// PaymentFailurePage.tsx
import React from 'react';

const PaymentFailurePage: React.FC = () => {
  return (
    <div className="payment-result">
      <div className="failure-message">
        <h2>Payment Failed</h2>
        <p>We couldn't process your payment at this time.</p>
        <p>Please try again or use another payment method.</p>
        <button onClick={() => window.history.back()}>Try Again</button>
      </div>
    </div>
  );
};

export default PaymentFailurePage;
