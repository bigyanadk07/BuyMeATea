const User = require('../models/user');
const { cloudinary } = require('../config/cloudinary');
const activityLogger = require('../middleware/activityLogger');
const bcrypt = require('bcryptjs');

// Get current user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name email profilePic bio links social');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ 
      name: user.name, 
      email: user.email,
      profilePic: user.profilePic,
      bio: user.bio || '',
      links: user.links || {},
      social: user.social || {}
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all creator profiles
exports.getAllProfiles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const creators = await User.find()
      .select('name profilePic bio email links social')
      .skip(skip)
      .limit(limit)
      .sort({ name: 1 });

    res.status(200).json(creators);
  } catch (err) {
    console.error('Error fetching all creators:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update profile information
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, links, social } = req.body;
    
    // Validate input
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    // Validate bio length if provided
    if (bio && bio.length > 250) {
      return res.status(400).json({ message: 'Bio cannot be more than 250 characters' });
    }

    // Get old user data for activity logging
    const oldUser = await User.findById(req.user.id);
    
    // Update user
    const updateData = { name };
    
    // Only add bio to update if it was provided
    if (bio !== undefined) {
      updateData.bio = bio;
    }

    // Update social links if provided
    if (links) {
      updateData.links = {
        ...oldUser.links,
        ...links
      };
    }

    // Update social profiles if provided
    if (social) {
      updateData.social = {
        ...oldUser.social,
        ...social
      };
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select('name email profilePic bio links social');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log activity for name update
    await activityLogger.logActivity(req.user.id, 'profile_update_name', req, {
      oldValue: oldUser.name,
      newValue: name
    });
    
    // Log activity for bio update if bio was changed
    if (bio !== undefined && oldUser.bio !== bio) {
      await activityLogger.logActivity(req.user.id, 'profile_update_bio', req, {
        oldValue: oldUser.bio || '',
        newValue: bio || ''
      });
    }

    // Log activity for social links update if provided
    if (links) {
      await activityLogger.logActivity(req.user.id, 'profile_update_links', req);
    }

    // Log activity for social profiles update if provided
    if (social) {
      await activityLogger.logActivity(req.user.id, 'profile_update_social', req);
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        bio: user.bio || '',
        links: user.links || {},
        social: user.social || {}
      }
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Update social links
exports.updateSocialLinks = async (req, res) => {
  try {
    const { social } = req.body;  // Changed from socialLinks to social
    
    // Validate input
    if (!social) {
      return res.status(400).json({ message: 'Social links data is required' });
    }

    // Get old user data for activity logging
    const oldUser = await User.findById(req.user.id);
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { social },  // Changed from socialLinks to social
      { new: true }
    ).select('name email profilePic social');  // Changed from socialLinks to social

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log activity
    await activityLogger.logActivity(req.user.id, 'profile_update_social', req, {
      oldValue: oldUser.social || {},  // Changed from socialLinks to social
      newValue: social  // Changed from socialLinks to social
    });

    res.status(200).json({
      success: true,
      message: 'Social links updated successfully',
      user: {
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        social: user.social  // Changed from socialLinks to social
      }
    });
  } catch (err) {
    console.error('Error updating social links:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update only bio
exports.updateBio = async (req, res) => {
  try {
    const { bio } = req.body;
    
    // Validate bio length
    if (bio && bio.length > 250) {
      return res.status(400).json({ message: 'Bio cannot be more than 250 characters' });
    }

    // Get old user data for activity logging
    const oldUser = await User.findById(req.user.id);
    
    // Update user's bio
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { bio: bio || '' },
      { new: true }
    ).select('name email profilePic bio links social');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log activity for bio update
    await activityLogger.logActivity(req.user.id, 'profile_update_bio', req, {
      oldValue: oldUser.bio || '',
      newValue: bio || ''
    });

    res.status(200).json({
      message: 'Bio updated successfully',
      user: {
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        bio: user.bio || '',
        links: user.links || {},
        social: user.social || {}
      }
    });
  } catch (err) {
    console.error('Error updating bio:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Find user with password
    const user = await User.findById(req.user.id).select('+password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    // Log activity
    await activityLogger.logActivity(req.user.id, 'profile_update_password', req);
    
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload profile picture
exports.uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Get current user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete previous profile picture from Cloudinary if exists
    if (user.profilePic && user.profilePicId) {
      await cloudinary.uploader.destroy(user.profilePicId);
    }

    // Update profilePic and profilePicId
    user.profilePic = req.file.path;
    user.profilePicId = req.file.filename;

    // Only validate modified fields
    await user.save({ validateModifiedOnly: true });

    res.status(200).json({
      success: true,
      message: 'Profile picture updated successfully',
      profilePic: user.profilePic,
      bio: user.bio || '',
      links: user.links || {},
      social: user.social || {}
    });
  } catch (error) {
    console.error('Profile picture upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading profile picture',
      error: error.message
    });
  }
};

// Delete profile picture
exports.deleteProfilePic = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Check if user has a profile picture
    if (!user.profilePic || !user.profilePicId) {
      return res.status(400).json({
        success: false,
        message: 'No profile picture to delete'
      });
    }
    
    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(user.profilePicId);
    
    // Remove profile pic info from user
    user.profilePic = '';
    user.profilePicId = '';
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Profile picture deleted successfully',
      bio: user.bio || '',
      links: user.links || {},
      social: user.social || {}
    });
  } catch (error) {
    console.error('Delete profile picture error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting profile picture',
      error: error.message
    });
  }
};

// Get profile picture
exports.getProfilePic = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.profilePic) {
      return res.status(404).json({
        success: false,
        message: 'No profile picture found'
      });
    }
    
    res.status(200).json({
      success: true,
      profilePic: user.profilePic,
      bio: user.bio || '',
      links: user.links || {},
      social: user.social || {}
    });
  } catch (error) {
    console.error('Get profile picture error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving profile picture',
      error: error.message
    });
  }
};