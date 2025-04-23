const express = require('express');
const morgan = require('morgan');

import userRouter from './routers/userRouter';
import globalErrorHandler from './controllers/errorController';

//express app
const app = express();

//development tool for the request log
app.use(morgan('dev'));

//serving the static files
app.use(express.static('public'));

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

app.use('/api/v1/users', userRouter);

app.use(globalErrorHandler);

module.exports = app;
