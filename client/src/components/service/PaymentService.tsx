// PaymentService.ts
const API_BASE_URL = process.env.REACT_APP_API_URL;

export interface InitiatePaymentResponse {
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

export interface VerifyPaymentData {
  amt: number;
  rid: string;
  pid: string;
  scd: string;
}

export const initiatePayment = async (amount: number): Promise<InitiatePaymentResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/esewa/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to initiate payment');
    }

    return await response.json();
  } catch (error) {
    console.error('Payment service error:', error);
    throw error;
  }
};

export const verifyPayment = async (data: VerifyPaymentData): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/esewa/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to verify payment');
    }

    return await response.json();
  } catch (error) {
    console.error('Payment verification error:', error);
    throw error;
  }
};
