const mongoose = require('mongoose');
const validator = require('validator/es');
const bcrypt = require('bcrypt');

//=>
// Database Schema for users (defining fields)
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full Name is required'],
    },
    email: {
      type: String,
      validate: [validator.isEmail, 'Please provide a valid email'],
      required: [true, 'Email is required'],
      unique: [true, 'Email is already used'],
    },
    dialCode: {
      type: String,
      required: [true, 'Mobile number is required'],
    },
    mobile: {
      type: Number,
      required: [true, 'Mobile number is required'],
      unique: [true, 'Mobile number already used'],
      validate: [
        () => {
          return this.length === 10;
        },
        'please enter a valid mobile number',
      ],
    },
    image: String,
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    favorites: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Card',
      },
    ],
    password: {
      type: String,
      required: [true, 'Password is required'],
      min: 8,
      max: 64,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Password is required'],
      min: 8,
      max: 64,
      validate: [
        function (val) {
          return this.password === val;
        },
        'Password and PasswordConfirm must be same',
      ],
    },
    passwordResetToken: String,
    passwordResetExpire: Date,
    passwordChangedAt: Date,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

//=>
//  Encrypting the password
userSchema.pre('save', function (next) {
  //check if password is modified or not
  if (!this.isModified('password')) return next();

  //encrypt the password and empty the passwordConfirm
  this.password = bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

//=>
// change the passwordChangedAt property
userSchema.pre('save', function (next) {
  //check if field is modified or not
  if (!this.isModified('password') || this.isNew) return next();

  //set the password changed at
  this.passwordChangedAt = Date.now();
  next();
});

//=>
// comparing both passwords (user entered and actual)
userSchema.methods.checkPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//=>
// Get the password reset token and set the password reset Expire
userSchema.methods.getPasswordResetToken = function () {
  //create a string with 32 length
  const token = crypto.randomBytes(32).toString('hex');

  //now update the fields with hashed token
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  //set the passwordResetExpire
  this.passwordResetExpire = new Date() + 24 * 60 * 60 * 1000;

  //return the passwordResetToken (not hashed) (need to hash it again at the time of resetting it)
  return token;
};

//=>
// Creating model based on schema
const User = mongoose.model('User', userSchema);
