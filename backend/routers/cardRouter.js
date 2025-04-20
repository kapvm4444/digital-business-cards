const express = require('express');
const cardController = require('./../controllers/cardController');
const authController = require('./../controllers/authController');

const Router = express.Router();

//Routes without any params [get-all, create]
Router.route('/').get(cardController.getCards).post(cardController.createCard);

//Routes with params (id) [get-one, update, delete]
Router.route('/:id')
  .get(cardController.getCard)
  .patch(cardController.updateCard)
  .delete(cardController.deleteCard);

module.exports = Router;
