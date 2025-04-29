const express = require('express');
const cardController = require('./../controllers/cardController');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

//routes
//=>
// CARDS
// api/v1/cards         GET
// api/v1/cards/:id     GET (one)
// api/v1/cards         POST
// api/v1/cards/:id     PATCH
// api/v1/cards/:id     DELETE

//=>
// get user specific cards
// api/v1/cards/user-cards
// for logged-in users which user ID is already at req.user.id and get the cards according to that user

//=>
// User Routes
// /login
// /signup
// /logout
// /forgot-password
// /reset-password
// /update-password
// /me
// /update-me
// /favorites

const Router = express.Router();

Router.use(authController.protect);

Router.route('/favorites').get(
  cardController.getFavorites,
  cardController.getCards,
);

Router.route('/add-favorite/:id').post(userController.setFavorites);

//Routes without any params [get-all, create]
Router.route('/').get(cardController.getCards).post(cardController.createCard);

//Routes with params (id) [get-one, update, delete]
Router.route('/:id')
  .get(cardController.getCard)
  .patch(cardController.updateCard)
  .delete(cardController.deleteCard);

module.exports = Router;
