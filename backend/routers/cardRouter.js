const express = require('express');
const cardController = require('./../controllers/cardController');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const Router = express.Router();

Router.use(authController.protect);

Router.route('/favorites').get(
  cardController.getFavorites,
  cardController.getCards,
);

Router.route('/add/favorite/:id').post(userController.setFavorites);

//Routes without any params [get-all, create]
Router.route('/').get(cardController.getCards).post(cardController.createCard);

//Routes with params (id) [get-one, update, delete]
Router.route('/:id')
  .get(cardController.getCard)
  .patch(cardController.updateCard)
  .delete(cardController.deleteCard);

module.exports = Router;
