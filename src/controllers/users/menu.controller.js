import mongoose from "mongoose";
import Menu from "../../models/menu.model.js";
import Restaurant from "../../models/restaurant.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validateTimingSections } from "../../utils/validateTimingSections.js";

export const createMenu = asyncHandler(async (req, res) => {
  const createdBy = req.user._id;

  const {
    restaurantId,
    name,
    description,
    published,
    showDishesOnTop,
    validityPeriod,
    additionalText,
    outputDesigned,
    autoNumbering,
  } = req.body;

  const restaurant = await Restaurant.findOne({
    _id: restaurantId,
    ownerId: createdBy,
    isDeleted: false,
  });

  if (!restaurant) {
    throw new ApiError(404, "RESTAURANT_NOT_FOUND", req.lang);
  }

  if (validityPeriod?.length) {
    validateTimingSections(
      { openingHours: validityPeriod },
      req.lang,
      ApiError
    );
  }

  const existing = await Menu.findOne({ restaurantId, name });
  if (existing) {
    throw new ApiError(409, "MENU_ALREADY_EXISTS", req.lang);
  }

  if (published === "PUBLISH") {
    throw new ApiError(400, "CANNOT_PUBLISH_ON_CREATION", req.lang);
  }

  const menu = await Menu.create({
    restaurantId,
    name,
    description: description ?? "",
    published: published ?? "DRAFT",
    showDishesOnTop: showDishesOnTop ?? false,
    validityPeriod: validityPeriod ?? [],
    additionalText: additionalText ?? "",
    outputDesigned: outputDesigned ?? "",
    autoNumbering: autoNumbering ?? {
      enabled: false,
      showOnDishesList: false,
    },
    createdBy,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "MENU_CREATED_SUCCESSFULLY", req.lang, menu));
});

export const getMenusByRestaurant = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  if (!restaurantId) {
    throw new ApiError(400, "RESTAURANT_ID_REQUIRED", req.lang);
  }

  const aggregation = [];

  aggregation.push({
    $match: {
      restaurantId: new mongoose.Types.ObjectId(restaurantId),
      isDeleted: { $ne: true },
    },
  });

  aggregation.push(
    {
      $lookup: {
        from: "dishes",
        localField: "_id",
        foreignField: "menuId",
        as: "dishes",
      },
    },
    {
      $addFields: {
        dishesCount: { $size: "$dishes" },
      },
    }
  );

  aggregation.push({
    $lookup: {
      from: "categories",
      localField: "_id",
      foreignField: "menuId",
      as: "categories",
    },
  });
  aggregation.push({
    $addFields: {
      categoriesCount: { $size: "$categories" },
    },
  });

  aggregation.push({
    $facet: {
      menus: [
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            published: 1,
            showDishesOnTop: 1,
            dishesCount: 1,
            categoriesCount: 1,
            createdAt: 1,
            updatedAt: 1,
            menusImages: 1,
          },
        },
      ],
      totalCount: [{ $count: "count" }],
    },
  });

  const result = await Menu.aggregate(aggregation);
  const menus = result[0].menus;
  const totalCount = result[0].totalCount[0]
    ? result[0].totalCount[0].count
    : 0;
  if (!menus.length) {
    throw new ApiError(404, "NO_MENUS_FOUND", req.lang);
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      menus.length > 0 ? "MENUS_FETCHED_SUCCESSFULLY" : "NO_MENUS_FOUND",
      req.lang,
      menus.length > 0
        ? {
            menus,
            total_page: Math.ceil(totalCount / limit),
            current_page: page,
            total_records: totalCount,
            per_page: limit,
          }
        : null
    )
  );
});

export const getMenuById = async (req, res) => {
  const { menuId } = req.params;

  if (!menuId) {
    throw new ApiError(400, "MENU_ID_REQUIRED", req.lang);
  }

  const menu = await Menu.findOne({
    _id: menuId,
    isDeleted: { $ne: true },
  });

  if (!menu) {
    throw new ApiError(404, "MENU_NOT_FOUND", req.lang);
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "MENU_FETCHED_SUCCESSFULLY", req.lang, menu));
};

export const updateMenu = asyncHandler(async (req, res) => {
  const updatedBy = req.user._id;
  const { menuId } = req.params;
  const {
    restaurantId,
    name,
    description,
    published,
    showDishesOnTop,
    validityPeriod,
    additionalText,
    outputDesigned,
    autoNumbering,
  } = req.body;

  // Verify the restaurant belongs to the user
  const restaurant = await Restaurant.findOne({
    _id: restaurantId,
    ownerId: updatedBy,
    isDeleted: false,
  });
  if (!restaurant) {
    throw new ApiError(404, "RESTAURANT_NOT_FOUND", req.lang);
  }

  // Verify the menu exists and belongs to this restaurant
  const menu = await Menu.findOne({ _id: menuId, restaurantId });
  if (!menu) {
    throw new ApiError(404, "MENU_NOT_FOUND", req.lang);
  }

  // Validate validity periods if provided
  if (validityPeriod?.length) {
    validateTimingSections(
      { openingHours: validityPeriod },
      req.lang,
      ApiError
    );
  }

  // Check for name conflict only if name is being changed
  if (name && name !== menu.name) {
    const existing = await Menu.findOne({ restaurantId, name });
    if (existing) {
      throw new ApiError(409, "MENU_ALREADY_EXISTS", req.lang);
    }
  }

  // Build update object with only provided fields
  const updateFields = {};
  if (name !== undefined) updateFields.name = name;
  if (description !== undefined) updateFields.description = description;
  if (published !== undefined) updateFields.published = published;
  if (showDishesOnTop !== undefined)
    updateFields.showDishesOnTop = showDishesOnTop;
  if (validityPeriod !== undefined)
    updateFields.validityPeriod = validityPeriod;
  if (additionalText !== undefined)
    updateFields.additionalText = additionalText;
  if (outputDesigned !== undefined)
    updateFields.outputDesigned = outputDesigned;
  if (autoNumbering !== undefined) updateFields.autoNumbering = autoNumbering;
  updateFields.updatedBy = updatedBy;

  const updatedMenu = await Menu.findByIdAndUpdate(
    menuId,
    { $set: updateFields },
    { new: true, runValidators: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, "MENU_UPDATED_SUCCESSFULLY", req.lang, updatedMenu)
    );
});

export const deleteMenu = async (req, res) => {
  const { menuId } = req.params;
  const ownerId = req.user._id;

  const menu = await Menu.findById(menuId);
  if (!menu) {
    throw new ApiError(404, "MENU_NOT_FOUND", req.lang);
  }

  const restaurant = await Restaurant.findOne({
    _id: menu.restaurantId,
    ownerId,
    isDeleted: false,
  });

  if (!restaurant) {
    throw new ApiError(403, "UNAUTHORIZED", req.lang);
  }
  // Soft delete the menu
  menu.isDeleted = true;
  await menu.save();

  return res.status(200).json(new ApiResponse(200, "MENU_DELETED_SUCCESSFULLY", req.lang, null));
};
