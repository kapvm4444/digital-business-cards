const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');

//=>
// signup
// login
// protect
// restrictTo
// create and send token
// me
// update-me
// delete-me
// forgot-password
// reset-password
// update-password

//=>
// create JWT token
const getToken = (id) => {
  return jwt.sign(id, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//=>
// send Token
const createSendToken = () => {};

//=>
// signup
exports.signup = (req, res, next) => {
  // get the details of users
  // filter/sanitize the data
  // save the data to database
  // log in the user
};
