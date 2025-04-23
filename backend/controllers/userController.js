const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const User = require('./../models/userModel');

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  let id;
  if (req.user) id = req.user._id;
  else if (req.params.id) id = req.params.id;

  if (!id)
    return next(new AppError(401, 'User not available, please log in again'));

  const user = await User.findByIdAndUpdate(id, {
    active: false,
    deletedAt: Date.now(),
  });
});

exports.getUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);

exports.createUser = factory.createOne(User);

exports.updateUser = factory.updateOne(User);

//we are not deleting user we are simply deactivating it
/* exports.deleteUser = factory.deleteOne(User);*/
