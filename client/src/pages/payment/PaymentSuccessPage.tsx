// PaymentSuccessPage.tsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { verifyPayment } from '../../components/service/PaymentService';

const PaymentSuccessPage: React.FC = () => {
  const [verified, setVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();

  useEffect(() => {
    const verifyThePayment = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const pid = params.get('oid');
        const amt = params.get('amt');
        const rid = params.get('refId');
        const scd = process.env.REACT_APP_ESEWA_MERCHANT_ID || '';

        if (pid && amt && rid) {
          const parsedAmt = parseFloat(amt);
          const result = await verifyPayment({ amt: parsedAmt, pid, rid, scd });
          setVerified(result.success);
        } else {
          setVerified(false);
        }
      } catch (error) {
        console.error("Payment verification failed:", error);
        setVerified(false);
      } finally {
        setLoading(false);
      }
    };

    verifyThePayment();
  }, [location]);

  if (loading) {
    return <div>Verifying your payment...</div>;
  }

  return (
    <div className="payment-result">
      {verified ? (
        <div className="success-message">
          <h2>Thank You for Your Tea!</h2>
          <p>Your payment was successful and has been verified.</p>
          <p>Your support means a lot to us!</p>
        </div>
      ) : (
        <div className="error-message">
          <h2>Payment Verification Failed</h2>
          <p>We received your payment but couldn't verify it.</p>
          <p>Please contact support with your transaction details.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccessPage;
