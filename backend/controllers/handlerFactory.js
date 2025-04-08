import catchAsync from './../utils/catchAsync';
const ApiFeature = require('./../utils/apiFeatures');

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // const docs = await Model.find();
    const features = new ApiFeature(Model.find(), req.query)
      .filter()
      .sort()
      .selectFields()
      .paginate();

    const docs = await features.query;

    res.status(200).json({
      status: 'success',
      length: docs.length,
      data: docs,
    });
  });

exports.getOne = (Model) => {
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });
};
