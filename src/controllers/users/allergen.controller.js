import mongoose from "mongoose";
import Allergen from "../../models/allergen.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const addAllergen = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { name, description } = req.body;
  if (!name) {
    throw new ApiError(403, "ALLERGEN_NAME_IS_REQUIRED", req.lang);
  }

  // check if the name is already exists
  const existAllergen = await Allergen.findOne({ name, userId });
  if (existAllergen) {
    throw new ApiError(409, "ALLERGEN_IS_ALREADY_EXISTS", req.lang);
  }

  const allergen = await Allergen.create({
    name,
    userId,
    description,
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, "ALLERGEN_CREATED_SUCCESSFULLY", req.lang, allergen)
    );
});

export const getAllergens = asyncHandler(async (req, res) => {
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
        allergens: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
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

  const result = await Allergen.aggregate(aggregation);

  const allergens = result[0]?.allergens || [];
  const totalCount = result[0]?.totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      allergens.length > 0
        ? "ALLERGENS_FETCHED_SUCCESSFULLY"
        : "NO_ALLERGENS_FOUND",
      req.lang,
      allergens.length > 0
        ? {
            allergens,
            total_page: totalPages,
            current_page: page,
            total_records: totalCount,
            per_page: limit,
          }
        : null
    )
  );
});

export const updateAllergen = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "INVALID_ALLERGEN_ID", req.lang);
  }

  if (!name && !description) {
    throw new ApiError(
      400,
      "AT_LEAST_ONE_FIELD_IS_REQUIRED_TO_UPDATE",
      req.lang
    );
  }

  const allergen = await Allergen.findById(id);

  if (!allergen) {
    throw new ApiError(404, "ALLERGEN_NOT_FOUND", req.lang);
  }

  // Check duplicate name
  if (name && name !== allergen.name) {
    const existingAllergen = await Allergen.findOne({
      name,
      _id: { $ne: id },
    });

    if (existingAllergen) {
      throw new ApiError(409, "ALLERGEN_ALREADY_EXISTS", req.lang);
    }

    allergen.name = name;
  }

  if (description !== undefined) allergen.description = description;

  await allergen.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, "ALLERGEN_UPDATED_SUCCESSFULLY", req.lang, allergen)
    );
});

export const deleteAllergen = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "INVALID_ALLERGEN_ID", req.lang);
  }

  const allergen = await Allergen.findById(id);

  if (!allergen) {
    throw new ApiError(404, "ALLERGEN_NOT_FOUND", req.lang);
  }

  await Allergen.findByIdAndDelete(id);

  return res
    .status(200)
    .json(
      new ApiResponse(200, "ALLERGEN_DELETED_SUCCESSFULLY", req.lang, null)
    );
});
