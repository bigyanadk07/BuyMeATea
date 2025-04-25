const Activity = require('../models/activity');

const activityLogger = {
  /**
   * Log an activity
   * @param {string} userId - User ID
   * @param {string} actionType - Type of action
   * @param {object} req - Express request object
   * @param {object} details - Additional details about the action
   * @returns {Promise} - Promise resolving to the created activity or null
   */
  async logActivity(userId, actionType, req, details = {}) {
    try {
      if (!userId) {
        console.error('Activity logging error: No user ID provided');
        return null;
      }

      // Extract IP address and user agent
      const ipAddress = req.headers['x-forwarded-for'] || 
                        req.connection.remoteAddress || 
                        req.socket.remoteAddress || 
                        '0.0.0.0';
                        
      const userAgent = req.headers['user-agent'] || 'Unknown';

      // Create and return activity
      const activity = await Activity.create({
        user: userId,
        actionType,
        ipAddress,
        userAgent,
        details
      });
      
      return activity;
    } catch (error) {
      console.error('Error logging activity:', error);
      // Don't throw error to prevent disrupting the main flow
      return null;
    }
  }
};

module.exports = activityLogger;