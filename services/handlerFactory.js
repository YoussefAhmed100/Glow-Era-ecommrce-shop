const asynchandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFueatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
  asynchandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id);

    if (!document) {
      return next(new ApiError(`No document for this id: ${id}`, 404));
    }

    await document.deleteOne();
    res.status(200).json({ message: "document deleted successfully" });
  });

exports.updateOne = (Model) =>
  asynchandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(
        new ApiError(`No document for this id:${req.params.id}`, 404)
      );
    }
    await document.save();
    res
      .status(200)
      .json({ message: "document updated successfully ", data: document });
  });

exports.createOne = (Model) =>
  asynchandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({ dada: document });
  });
exports.getOne = (Model, populationOption) =>
  asynchandler(async (req, res, next) => {
    const { id } = req.params;
    // buid query
    let query = Model.findById(id);
    if (populationOption) {
      query = query.populate(populationOption);
    }
    // Execute query
    const document = await query;
    if (!document) {
      return next(new ApiError(`No document for this id: ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

exports.getAll = (Model) =>
  asynchandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }

    const countDecuoments = await Model.countDocuments();
    // Build query
    const apiFeatures = new ApiFueatures(Model.find(filter), req.query)
      .paginate(countDecuoments)
      .filter()
      .limitFields()
      .sort()
      .search();

    // Execute query
    const { mongooseQuery, paginateResult } = apiFeatures;
    const document = await mongooseQuery;
    res
      .status(200)
      .json({ results: document.length, paginateResult, data: document });
  });
