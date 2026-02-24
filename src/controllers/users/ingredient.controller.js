import mongoose from "mongoose";
import Ingredient from "../../models/ingredient.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const addIngredient = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { name, description, allergenIds, additiveIds } = req.body;

  if (!name) {
    throw new ApiError(403, "INGREDIENT_NAME_IS_REQUIRED", req.lang);
  }

  const existIngredient = await Ingredient.findOne({ name, userId });
  if (existIngredient) {
    throw new ApiError(409, "INGREDIENT_IS_ALREADY_EXISTS", req.lang);
  }

  const ingredient = await Ingredient.create({
    name,
    description,
    allergenIds,
    additiveIds,
    userId,
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "INGREDIENT_CREATED_SUCCESSFULLY",
        req.lang,
        ingredient
      )
    );
});

export const getIngredients = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  const matchStage = {};

  if (req.query.search) {
    matchStage.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { description: { $regex: req.query.search, $options: "i" } },
    ];
  }

  const aggregation = [
    { $match: matchStage },

    { $sort: { createdAt: -1 } },

    {
      $facet: {
        ingredients: [
          { $skip: skip },
          { $limit: limit },

          // Lookup Allergens
          {
            $lookup: {
              from: "allergens",
              localField: "allergenIds",
              foreignField: "_id",
              as: "allergens",
            },
          },

          // Lookup Additives
          {
            $lookup: {
              from: "additives",
              localField: "additiveIds",
              foreignField: "_id",
              as: "additives",
            },
          },

          {
            $project: {
              name: 1,
              description: 1,
              allergens: {
                _id: 1,
                name: 1,
                description: 1,
              },
              additives: {
                _id: 1,
                name: 1,
                code: 1,
                description: 1,
              },
              createdAt: 1,
              updatedAt: 1,
            },
          },
        ],

        totalCount: [{ $count: "count" }],
      },
    },
  ];

  const result = await Ingredient.aggregate(aggregation);

  const ingredients = result[0]?.ingredients || [];
  const totalCount = result[0]?.totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      ingredients.length > 0
        ? "INGREDIENTS_FETCHED_SUCCESSFULLY"
        : "NO_INGREDIENTS_FOUND",
      req.lang,
      ingredients.length > 0
        ? {
            ingredients,
            total_page: totalPages,
            current_page: page,
            total_records: totalCount,
            per_page: limit,
          }
        : null
    )
  );
});

export const updateIngredient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, allergenIds, additiveIds } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "INVALID_INGREDIENT_ID", req.lang);
  }

  const ingredient = await Ingredient.findById(id);

  if (!ingredient) {
    throw new ApiError(404, "INGREDIENT_NOT_FOUND", req.lang);
  }

  if (name && name !== ingredient.name) {
    const existing = await Ingredient.findOne({
      name,
      _id: { $ne: id },
    });

    if (existing) {
      throw new ApiError(409, "INGREDIENT_ALREADY_EXISTS", req.lang);
    }

    ingredient.name = name;
  }

  if (description !== undefined) ingredient.description = description;
  if (allergenIds) ingredient.allergenIds = allergenIds;
  if (additiveIds) ingredient.additiveIds = additiveIds;

  await ingredient.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "INGREDIENT_UPDATED_SUCCESSFULLY",
        req.lang,
        ingredient
      )
    );
});

export const deleteIngredient = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "INVALID_INGREDIENT_ID", req.lang);
  }

  const ingredient = await Ingredient.findById(id);

  if (!ingredient) {
    throw new ApiError(404, "INGREDIENT_NOT_FOUND", req.lang);
  }

  await Ingredient.findByIdAndDelete(id);

  return res
    .status(200)
    .json(
      new ApiResponse(200, "INGREDIENT_DELETED_SUCCESSFULLY", req.lang, null)
    );
});
