const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const Router = express.Router();
//=>
// login
Router.route('/login').post(authController.login);

//=>
// /signup
Router.route('/signup').post(authController.signup);

//=>
// /logout
//todo pending task

//=>
// /forgot-password
Router.route('/forgot-password').post(authController.forgotPassword);

//=>
// /reset-password
Router.route('/reset-password/:token').post(authController.resetPassword);

//NOTE
// middleware for checking if user is logged in or not
Router.use(authController.protect);

//=>
// /update-password
Router.route('/update-password').post(authController.updatePassword);

//=>
// /me
Router.route('/me').get(userController.getMe, userController.getUser);

//=>
// /update-me
Router.route('/update-me').post(
  userController.updateMe,
  userController.updateUser,
);

Router.route('/delete-me').delete(userController.deleteMe);

//Note
// middleware for restriction
Router.use(authController.restrictTo('admin'));

Router.route('/').get(userController.getUsers).post(userController.createUser);

Router.route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteMe);

module.exports = Router;
