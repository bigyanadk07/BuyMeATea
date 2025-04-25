const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { upload } = require('../config/cloudinary');
const profileController = require('../controllers/profileController');
const activityLogger = require('../middleware/activityLogger');

// Create a middleware for activity logging wrapper
const withActivityLogging = (controllerFn, activityType) => {
  return async (req, res, next) => {
    try {
      // Store the original res.status and res.json methods
      const originalStatus = res.status;
      const originalJson = res.json;
      let responseData = null;
      let statusCode = 200;
      
      // Override res.status to capture the status code
      res.status = function(code) {
        statusCode = code;
        return this;
      };
      
      // Override res.json to capture the response data
      res.json = function(data) {
        responseData = data;
        
        // If successful operation, log the activity
        if (statusCode >= 200 && statusCode < 300 && (!data.success || data.success === true)) {
          activityLogger.logActivity(req.user.id, activityType, req)
            .catch(err => console.error('Error logging activity:', err));
        }
        
        // Restore original methods and send response
        res.status = originalStatus;
        res.json = originalJson;
        return res.status(statusCode).json(data);
      };
      
      // Call the controller function
      await controllerFn(req, res, next);
    } catch (error) {
      console.error(`Error in ${activityType}:`, error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: `Error in ${activityType}`,
          error: error.message
        });
      }
    }
  };
};

// GET /api/profile - Get user profile
router.get('/', verifyToken, profileController.getUserProfile);

// GET /api/profile/all - Get all creator profiles
router.get('/all', profileController.getAllProfiles);

// PUT /api/profile/update - Update profile information
router.put('/update', verifyToken, profileController.updateProfile);

// PUT /api/profile/update-bio - Update only bio
router.put('/update-bio', verifyToken, profileController.updateBio);

// PUT /api/profile/update-social - Update social links
router.put(
  '/update-social',
  verifyToken,
  withActivityLogging(profileController.updateSocialLinks, 'profile_update_social')
);

// PUT /api/profile/change-password - Change password
router.put('/change-password', verifyToken, profileController.changePassword);

// POST /api/profile/upload-profile-pic - Upload profile picture
router.post(
  '/upload-profile-pic',
  verifyToken,
  upload.single('profilePic'),
  withActivityLogging(profileController.uploadProfilePic, 'profile_picture_upload')
);

// DELETE /api/profile/delete-profile-pic - Delete profile picture
router.delete(
  '/delete-profile-pic',
  verifyToken,
  withActivityLogging(profileController.deleteProfilePic, 'profile_picture_delete')
);

// GET /api/profile/profile-pic - Get profile picture
router.get(
  '/profile-pic',
  verifyToken,
  profileController.getProfilePic
);

module.exports = router;