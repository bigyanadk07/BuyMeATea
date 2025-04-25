// EsewaService.js (Node.js example)
const axios = require('axios');
const xml2js = require('xml2js');

class EsewaService {
  constructor() {
    this.merchantId = process.env.ESEWA_MERCHANT_ID;
    this.secretKey = process.env.ESEWA_SECRET_KEY;
    
    // Use the appropriate URL based on environment
    this.verifyUrl = process.env.NODE_ENV === 'production'
      ? 'https://esewa.com.np/epay/transrec'
      : 'https://uat.esewa.com.np/epay/transrec';
  }
  
  /**
   * Verify payment with eSewa
   * @param {string} oid - Order ID/Product ID
   * @param {string} amt - Amount
   * @param {string} refId - Reference ID provided by eSewa
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async verifyPayment(oid, amt, refId) {
    try {
      // Prepare form data for verification
      const params = new URLSearchParams();
      params.append('amt', amt);
      params.append('scd', this.merchantId);
      params.append('rid', refId);
      params.append('pid', oid);
      
      // Send verification request to eSewa
      const response = await axios.post(this.verifyUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      // Parse the XML response
      const result = await this.parseXmlResponse(response.data);
      
      // Check if response contains success status
      if (result && result.response_code === 'Success') {
        return { success: true, message: 'Payment verified successfully' };
      } else {
        return { success: false, message: 'Payment verification failed' };
      }
      
    } catch (error) {
      console.error('eSewa verification error:', error);
      return { success: false, message: 'Error during payment verification' };
    }
  }
  
  /**
   * Parse XML response from eSewa
   * @param {string} xmlData - XML response from eSewa
   * @returns {Promise<Object>} - Parsed XML as object
   */
  async parseXmlResponse(xmlData) {
    return new Promise((resolve, reject) => {
      xml2js.parseString(xmlData, { explicitArray: false }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.response);
        }
      });
    });
  }
}

module.exports = new EsewaService();