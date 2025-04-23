module.exports = (err, req, res, next) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log('---💥 ERROR---', err);
    res.status(err.statusCode).json({
      status: 'fail',
      message: 'Something went wrong!',
    });
  }

  next();
};
