const AppError = require('./../utils/appError');

const handleJWTError = () =>
  new AppError(401, 'You are not logged in, Please log in again');

const handleJWTExpiredError = () =>
  new AppError(401, 'Token Expired, please log in again');

const handleCastErrorDB = (err) => {
  return new AppError(400, `Invalid ${err.path}: ${err.value}`);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  return new AppError(400, `Invalid Data Entered: ${errors.join('. ')}`);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:\\.|[^\\])*?\1/)[0];
  return new AppError(400, `Duplicate field value: ${value} use another value`);
};

const showErr = (err, req, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } // Error if we do not have any clue about the error
  else {
    console.log('---💥 ERROR---', err);
    res.status(err.statusCode).json({
      status: 'fail',
      message: 'Something went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  let error = {
    ...err,
    name: err.name,
    errmsg: err.errmsg,
    message: err.message,
  };

  //handling "invalid ID accessed" error (while getting single tour) [used the 'CastError' *name* by mongoose when generated]
  if (error.name === 'CastError') error = handleCastErrorDB(error);
  //handling the "duplicate value entered" error (while duplicate data is given to DB) [used the 11000 *code* by mongoose when generated]
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  //all other validation errors together (like duration, image, summary, etc.). all of that are handled together
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
  //JWT error if there is mismatched token
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  showErr(error, req, res);

  next();
};
