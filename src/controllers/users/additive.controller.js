import mongoose from "mongoose";
import Additive from "../../models/additive.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { generateUniqueAdditiveId } from "../../utils/helperFunctions.js";

export const addAdditive = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { name, description } = req.body;

  if (!name) {
    throw new ApiError(403, "ADDITIVE_NAME_IS_REQUIRED", req.lang);
  }

  // check if the name is already exists
  const existAdditive = await Additive.findOne({ name, userId });
  if (existAdditive) {
    throw new ApiError(409, "ADDITIVE_IS_ALREADY_EXISTS", req.lang);
  }
  const code = await generateUniqueAdditiveId();

  const additive = await Additive.create({
    code,
    name,
    userId,
    description,
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, "ADDITIVE_CREATED_SUCCESSFULLY", req.lang, additive)
    );
});

export const getAdditives = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  const matchStage = {};

  if (req.query.status) {
    matchStage.status = req.query.status;
  }

  if (req.query.search) {
    matchStage.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { description: { $regex: req.query.search, $options: "i" } },
    ];
  }

  const allowedSortFields = ["name", "createdAt", "updatedAt"];
  const sortBy = allowedSortFields.includes(req.query.sortBy)
    ? req.query.sortBy
    : "createdAt";

  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

  const sortStage = {
    [sortBy]: sortOrder,
  };

  const aggregation = [
    { $match: matchStage },
    { $sort: sortStage },
    {
      $facet: {
        additives: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              code: 1,
              name: 1,
              description: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ];

  const result = await Additive.aggregate(aggregation);

  const additives = result[0]?.additives || [];
  const totalCount = result[0]?.totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      additives.length > 0
        ? "ADDITIVES_FETCHED_SUCCESSFULLY"
        : "NO_ADDITIVES_FOUND",
      req.lang,
      additives.length > 0
        ? {
            additives,
            total_page: totalPages,
            current_page: page,
            total_records: totalCount,
            per_page: limit,
          }
        : null
    )
  );
});

export const updateAdditive = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "INVALID_ADDITIVE_ID", req.lang);
  }

  if (!name && !description) {
    throw new ApiError(
      400,
      "AT_LEAST_ONE_FIELD_IS_REQUIRED_TO_UPDATE",
      req.lang
    );
  }

  const additive = await Additive.findById(id);

  if (!additive) {
    throw new ApiError(404, "ADDITIVE_NOT_FOUND", req.lang);
  }

  // Check duplicate name
  if (name && name !== additive.name) {
    const existingAdditive = await Additive.findOne({
      name,
      _id: { $ne: id },
    });

    if (existingAdditive) {
      throw new ApiError(409, "ADDITIVE_ALREADY_EXISTS", req.lang);
    }

    additive.name = name;
  }

  if (description !== undefined) additive.description = description;

  await additive.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, "ADDITIVE_UPDATED_SUCCESSFULLY", req.lang, additive)
    );
});

export const deleteAdditive = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "INVALID_ADDITIVE_ID", req.lang);
  }

  const additive = await Additive.findById(id);

  if (!additive) {
    throw new ApiError(404, "ADDITIVE_NOT_FOUND", req.lang);
  }

  await Additive.findByIdAndDelete(id);

  return res
    .status(200)
    .json(
      new ApiResponse(200, "ADDITIVE_DELETED_SUCCESSFULLY", req.lang, null)
    );
});
