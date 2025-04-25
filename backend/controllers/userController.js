const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const User = require('./../models/userModel');

//=>
// get the details of the user for user profile
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

//=>
// update the details of the user [not passwords]
exports.updateMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

//=>
// delete the user [simply set the active: false]
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

//=>
// add favorite card to user data
exports.setFavorites = catchAsync(async (req, res, next) => {
  //1. get the user id from req.user and the card id from req.params\
  const userId = req.user._id;
  const cardId = req.params.id;
  let message = '';

  //2. get the favorites array from that user id
  const user = await User.findById(userId);
  if (!user)
    return next(new AppError(401, 'User does not exist please log in again'));

  //3. check if Item exists in that array
  //3.1 if yes then remove it
  if (user.favorites.includes(cardId)) {
    user.favorites = user.favorites.filter((id) => id !== cardId);
    message = 'Removed from favorite';
  }
  //3.2 if no then add it to the array
  else {
    user.favorites.push(cardId);
    message = 'Added from favorite';
  }
  //4. update the user in database
  await user.save();

  //send again the user data
  res.status(200).json({
    status: 'success',
    message,
    data: user,
  });
});

exports.getUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);

exports.createUser = factory.createOne(User);

exports.updateUser = factory.updateOne(User);

//we are not deleting user we are simply deactivating it
/* exports.deleteUser = factory.deleteOne(User);*/
