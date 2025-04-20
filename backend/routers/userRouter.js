const express = require('express');
const userController = require('./../controllers/');

const Router = express.Router();

Router.route('/').get(userController.getUser);

module.exports = Router;
