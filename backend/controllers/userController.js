const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');

exports.getUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);

exports.createUser = factory.createOne(User);

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
