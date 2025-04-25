import catchAsync from './../utils/catchAsync';
const ApiFeature = require('./../utils/apiFeatures');

//=>
// get all the doc
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //for getting the user specific favorites
    let filter = {};
    if (req.params.userId) filter = { ...filter, user: req.params.userId };

    // const docs = await Model.find();
    const features = new ApiFeature(Model.find(filter), req.query)
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

//=>
// Get just one doc
exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

//=>
// Create One
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    req.body;
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: doc,
    });
  });

//=>
// Update One
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

//=>
// Delete One
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
    });
  });
