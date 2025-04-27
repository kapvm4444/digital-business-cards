const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Email = require('./../utils/email');
const User = require('./../models/userModel');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const geoIp = require('geoip-lite');
const { getClientIp } = require('request-ip');

//=>
// create JWT token
const getJWTToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//=>
// send Token
const createSendToken = (userData, req, res, statusCode) => {
  //get the JWT token for sending it to user
  const token = getJWTToken(userData._id);

  //create cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  };

  //send the cookie
  res.cookie('jwt', token, cookieOptions);

  //send the response with token
  res.status(201).json({
    status: 'success',
    token,
    data: userData,
  });
};

//=>
// signup
exports.signup = catchAsync(async (req, res, next) => {
  // get the details of users
  if (req.body.role) req.body.role = undefined;
  const userData = req.body;

  // save the data to database
  const user = await User.create(userData);

  const emailData = {
    user,
    link: `${process.env.DOMAIN}/profile`,
  };

  //send the email
  // await new Email(emailData).sendWelcome();

  // log in the user
  createSendToken(user, req, res, 201);
});

//=>
// Login User
exports.login = catchAsync(async (req, res, next) => {
  //get the email and password
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError(400, 'Please provide email and password both'));

  //check if user with email is available or not and check the password
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.checkPassword(password, user.password)))
    return next(new AppError(401, 'Email or password incorrect'));

  // get the user location
  const clientIp = getClientIp(req);
  const location = geoIp.lookup('1.1.1.1');

  //set the email data
  const emailData = {
    user,
    location,
    link: `${process.env.DOMAIN}/forget-password`,
  };

  //send the email
  await new Email(emailData).sendLoginWarning();

  //log in with token
  createSendToken(user, req, res, 200);
});

//=>
// Protect (a middleware)
exports.protect = catchAsync(async (req, res, next) => {
  //get the token from cookies
  const token = req.cookies.jwt;
  if (!token)
    return next(
      new AppError(403, 'You are not logged in, please login to continue'),
    );

  //decode the token and check if token is valid or not
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //check if the user with the id is available or not
  const user = await User.findById(decoded.id);
  if (!user)
    return next(new AppError(401, 'User does not exist, please log in again'));

  //check if user changed the password before logging in or not?
  if (user.isPasswordChanged(decoded.iat))
    return next(
      new AppError(401, 'Your password is changed, please log in again'),
    );

  //set the user with req object
  req.user = user;

  next();
});

//=>
// restrictTo
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError(403, 'You are not authorized to use this resource'),
      );

    next();
  };
};

//=>
// Update-password
exports.updatePassword = catchAsync(async (req, res, next) => {
  //1. get the values
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;

  //2. check if old password is correct or not
  const user = await User.findById(req.user._id).select('+password');
  if (!user)
    return next(new AppError(401, 'Something went wrong, please log in again'));

  if (!(await user.checkPassword(currentPassword, user.password)))
    return next(new AppError(401, 'Your current Password is incorrect'));

  //3. check if new pass is not same as old pass
  if (newPassword === currentPassword)
    return next(
      new AppError(401, 'New Password must not be same as the old password'),
    );

  //4. Update and save the password
  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  await user.save();

  //get the user location
  const clientIp = getClientIp(req);
  const location = geoIp.lookup(clientIp);

  //set the email data
  const emailData = {
    user,
    location,
    link: `${process.env.DOMAIN}/forgot-password`,
  };

  //send the email
  await new Email(emailData).sendPasswordChangeWarning();

  //send the response
  createSendToken(user, req, res, 200);
});

//=>
// forgot-password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //get the email from the body
  const { email } = req.body;

  //check if user with that email exists or not
  const user = await User.findOne({ email });
  if (!user)
    return next(new AppError(401, 'User with that email does not exist'));

  //get password reset token and set password reset token expire time of 24 h [note: token is not hashed, need to hash in reset password]
  try {
    const passwordResetToken = user.getPasswordResetToken();

    //send the email with the password reset link and send a message that token is sent in response
    const link = `${process.env.DOMAIN}/api/v1/users/reset-password/${passwordResetToken}`;

    //set email data
    const emailData = {
      user,
      link,
    };

    await new Email(emailData).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message:
        'Password reset email is sent to your mail inbox, also check spam folders',
    });
  } catch (e) {
    console.log(e.message);
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email, please try again later',
        500,
      ),
    );
  }
});

//=>
// reset-password
exports.resetPassword = catchAsync(async (req, res, next) => {
  // get the token from url and hash the token
  const { token } = req.params;

  // crypto.createHash('sha-256').update(token).digest('hex')
  const hashedToken = crypto.createHash('sha-256').update(token).digest('hex');

  // check if user with that token exists or not and also check if it is expired or not
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpire: { $gt: Date.now() },
  });
  if (!user) return next(new AppError(401, 'Token is Invalid or Expired'));

  // get the data of new password and new password confirm from body
  const { newPassword, newPasswordConfirm } = req.body;

  // check if password and confirm password are same or not
  if (newPassword !== newPasswordConfirm)
    return next(
      new AppError(401, 'Password and Password-confirm must be same'),
    );

  // update the password in user and save it (and send confirm msg in response)
  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  user.save();

  //set the email data
  const emailData = {
    user,
    location,
    link: `${process.env.DOMAIN}/forgot-password`,
  };

  //send the warning email
  await new Email(emailData).sendPasswordChangeWarning();
});

//=>
// logout
exports.logout = (req, res, next) => {
  res.cookie('jwt', 'ABC', { expires: new Date(Date.now() - 36000000) });

  res.status(201).json({
    status: 'success',
    message: 'Successfully logged out',
  });
};
