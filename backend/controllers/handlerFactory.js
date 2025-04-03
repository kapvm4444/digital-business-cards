import catchAsync from './../utils/catchAsync'

exports.getAll = (Model) => catchAsync(async (req, res, next) => {
    const docs = await Model.find();

    res.status(200).json({
        status: 'success',
        length: docs.length,
        docs
    })
})