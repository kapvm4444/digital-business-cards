const express = require('express');
const morgan = require('morgan');

const userRouter = require('./routers/userRouter');
const cardRouter = require('./routers/cardRouter');
const globalErrorHandler = require('./controllers/errorController');
const { join } = require('node:path');
const requestIp = require('request-ip');
//express app
const app = express();

//using the requestIp middleware for getting the IP of user
app.use(requestIp.mw());

//setting the view engine for rendering the email templates
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'email-views'));

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
// get user specific cards (both add and remove favorite is implemented in cards router)
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
app.use('/api/v1/cards', cardRouter);

app.use(globalErrorHandler);

module.exports = app;
