const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const slugify = require('slugify');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'publisher', 'admin'],
    default: 'user'
  },
  profilePicture: {
    type: String,
    default: ''
  },
  profilePic: {
    type: String,
    default: ''
  },
  profilePicId: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: [250, 'Bio cannot be more than 250 characters'],
    default: ''
  },
  location: {
    type: String,
    trim: true
  },
  links: {
    instagram: String,
    youtube: String,
    portfolio: String,
    twitter: String,
    facebook: String
  },
  social: {
    instagram: String,
    youtube: String,
    twitter: String,
    facebook: String
  },
  totalTeas: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    trim: true
  },
  followers: {
    type: Number,
    default: 0
  },
  username: {
    type: String,
    unique: true,
    trim: true
  },
  paymentMethods: {
    esewa: {
      enabled: {
        type: Boolean,
        default: false
      },
      id: {
        type: String,
        trim: true
      }
    },
    khalti: {
      enabled: {
        type: Boolean,
        default: false
      },
      id: {
        type: String,
        trim: true
      }
    }
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate username slug from name if not provided
UserSchema.pre('save', async function(next) {
  if (!this.isModified('username') && this.isModified('name')) {
    this.username = slugify(this.name, { lower: true, strict: true });
    
    // Check if username already exists
    const usernameExists = await this.constructor.findOne({ username: this.username });
    if (usernameExists) {
      // Append random string to make unique
      const randomString = crypto.randomBytes(3).toString('hex');
      this.username = `${this.username}-${randomString}`;
    }
  }
  next();
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash password with salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Sign JWT and return
UserSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.generatePasswordResetToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire time to 10 minutes
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);