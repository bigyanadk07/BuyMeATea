const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const Activity = require('../models/activity');

// GET /api/activities - Get user activities
router.get('/', verifyToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build query
    const query = { user: req.user.id };
    
    // Filter by action type if provided
    if (req.query.type && req.query.type !== 'all') {
      query.actionType = req.query.type;
    }
    
    // Filter by date range if provided
    if (req.query.startDate) {
      query.createdAt = { $gte: new Date(req.query.startDate) };
    }
    
    // Count total matching documents for pagination
    const total = await Activity.countDocuments(query);
    
    // Get activities with pagination
    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Format activities for response
    const formattedActivities = activities.map(activity => ({
      id: activity._id,
      action: activity.actionType,
      description: getActivityDescription(activity.actionType),
      timestamp: activity.createdAt,
      deviceInfo: {
        ipAddress: activity.ipAddress,
        userAgent: activity.userAgent
      },
      details: activity.details || {}
    }));
    
    res.status(200).json({
      success: true,
      data: formattedActivities,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching activities:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// DELETE /api/activities/clear - Clear activity history
router.delete('/clear', verifyToken, async (req, res) => {
  try {
    // Delete all activities for the current user
    const result = await Activity.deleteMany({ user: req.user.id });
    
    res.status(200).json({
      success: true,
      message: 'Activity history cleared successfully',
      count: result.deletedCount
    });
  } catch (err) {
    console.error('Error clearing activities:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Helper function to get human-readable descriptions for activity types
function getActivityDescription(actionType) {
  const descriptions = {
    login: 'User logged in to account',
    logout: 'User logged out of account',
    account_created: 'Created a new account',
    profile_update: 'User updated profile information',
    profile_update_name: 'User changed display name',
    profile_update_password: 'User changed password',
    profile_picture_upload: 'User uploaded profile picture',
    profile_picture_delete: 'User removed profile picture',
    password_reset_request: 'Requested password reset',
    password_reset_complete: 'Reset password',
    password_change: 'Changed password',
    profile_update_bio: 'Updated bio',
    social_link_update: 'Updated social links'
  };
  
  return descriptions[actionType] || 'Performed an action';
}

module.exports = router;