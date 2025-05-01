const factory = require('./handlerFactory');
const Card = require('./../models/cardModel');

exports.getFavorites = (req, res, next) => {
  req.params.userId = req.user._id;
  next();
};

exports.setUserId = (req, res, next) => {
  req.params.userId = req.user._id;
  next();
};

//Get All the Cards - No filter
exports.getCards = factory.getAll(Card);

//get One card according to ID
exports.getCard = factory.getOne(Card);

//Create the card
exports.createCard = factory.createOne(Card);

//update the details of the card
exports.updateCard = factory.updateOne(Card);

//delete the card
exports.deleteCard = factory.deleteOne(Card);
