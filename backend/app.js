const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const hpp = require('hpp');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const userRouter = require('./routers/userRouter');
const cardRouter = require('./routers/cardRouter');
const globalErrorHandler = require('./controllers/errorController');
const { join } = require('node:path');
const requestIp = require('request-ip');

//express app
const app = express();

//using the requestIp middleware for getting the IP of user
// app.use(requestIp.mw());

//let express know we are using the json and set the limit of json data to 20kb
app.use(express.json({ limit: '20kb' }));

//cors custom headers
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, PATCH, POST, DELETE, PUT');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Content-Length, Authorization',
  );
  next();
});

//cross-origin resource sharing
app.use(
  cors({
    origin: [
      'http://loaclhost:3000',
      'http://127.0.0.1:3000',
      'https://dbc.khush.pro',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  }),
);

//helmet - it changes some http headers for security
app.use(helmet());

//rateLimit - limit the rate of APIs that is called per time
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request at a time, Please try again after few hours',
});
/*app.use('/api', limiter);*/

//get the data from forms
app.use(express.urlencoded({ extended: true, limit: '20kb' }));

//mongo sanitize for sql Injection type attacks
app.use(mongoSanitize());

//hpp - for http parameter pollution (Parameters with duplicate or malicious values)
app.use(hpp());

//cross-site scripting security
app.use(xss());

//for cookies
app.use(cookieParser());

//compression for images
app.use(compression());

//setting the view engine for rendering the email templates
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'email-views'));

//development tool for the request log
app.use(morgan('dev'));

//serving the static files
app.use(express.static('public'));

//routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/cards', cardRouter);

app.get('*', (req, res) => {
  res.status(200).json({
    status: 'success',
    message:
      'Welcome to the CardStream APIs, this is just a Default message\n you are not accessing api right now',
  });
});

app.use(globalErrorHandler);

module.exports = app;

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
