import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import mongoose from "mongoose";
import restaurantType from "../../models/restaurantTypes.modal.js";
import serviceType from "../../models/serviceTypes.modal.js";
import businessType from "../../models/businessTypes.modal.js";
import cuisine from "../../models/cuisines.modal.js";
import dishType from "../../models/dishTypes.modal.js";
import dietType from "../../models/dietTypes.modal.js";
import Restaurant from "../../models/restaurant.model.js";

// ==================== RESTAURANT TYPE CRUD ====================

export const saveRestuarantType = asyncHandler(async (req, res) => {
  const { type } = req.body;

  if (!type) {
    throw new ApiError(400, "TYPE_IS_REQUIRED", req.lang);
  }

  const restType = await restaurantType.findOne({ name: type });
  if (restType) {
    throw new ApiError(409, "RESTAURANT_TYPE_IS_ALREADY_EXISTS", req.lang);
  }

  const saveStatus = await restaurantType.create({
    name: type,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "RESTAURANT_TYPE_IS_CREATED_SUCCESSFULLY",
        req.lang,
        saveStatus
      )
    );
});

export const getRestaurantTypes = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  const matchStage = {};

  if (req.query.status) {
    matchStage.status = req.query.status;
  }

  if (req.query.search) {
    matchStage.name = {
      $regex: req.query.search,
      $options: "i",
    };
  }

  const allowedSortFields = ["name", "status", "createdAt", "updatedAt"];
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
        types: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              name: 1,
              description: 1,
              status: 1,
              language: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ];

  const result = await restaurantType.aggregate(aggregation);

  const types = result[0]?.types || [];
  const totalCount = result[0]?.totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      types.length > 0
        ? "RESTAURANT_TYPES_FETCHED_SUCCESSFULLY"
        : "NO_RESTAURANT_TYPES_FOUND",
      req.lang,
      types.length > 0
        ? {
            types,
            total_page: totalPages,
            current_page: page,
            total_records: totalCount,
            per_page: limit,
            sort_by: sortBy,
            sort_order: sortOrder === 1 ? "asc" : "desc",
          }
        : null
    )
  );
});

export const getRestaurantTypeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "INVALID_RESTAURANT_TYPE_ID", req.lang);
  }

  const restType = await restaurantType.findById(id);

  if (!restType) {
    throw new ApiError(404, "RESTAURANT_TYPE_NOT_FOUND", req.lang);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "RESTAURANT_TYPE_FETCHED_SUCCESSFULLY",
        req.lang,
        restType
      )
    );
});

export const updateRestaurantType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type, status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "INVALID_RESTAURANT_TYPE_ID", req.lang);
  }

  if (!type && !status) {
    throw new ApiError(
      400,
      "AT_LEAST_ONE_FIELD_IS_REQUIRED_TO_UPDATE",
      req.lang
    );
  }

  const restType = await restaurantType.findById(id);

  if (!restType) {
    throw new ApiError(404, "RESTAURANT_TYPE_NOT_FOUND", req.lang);
  }

  if (type) {
    const isTypeExists = await restaurantType.findOne({
      name: type,
      _id: { $ne: id },
    });

    if (isTypeExists) {
      throw new ApiError(409, "RESTAURANT_TYPE_IS_ALREADY_EXISTS", req.lang);
    }

    restType.name = type;
  }

  if (status) {
    restType.status = status;
  }

  await restType.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "RESTAURANT_TYPE_UPDATED_SUCCESSFULLY",
        req.lang,
        restType
      )
    );
});

export const deleteRestaurantType = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "INVALID_RESTAURANT_TYPE_ID", req.lang);
  }

  const restType = await restaurantType.findById(id);

  if (!restType) {
    throw new ApiError(404, "RESTAURANT_TYPE_NOT_FOUND", req.lang);
  }

  await restaurantType.findByIdAndDelete(id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "RESTAURANT_TYPE_DELETED_SUCCESSFULLY",
        req.lang,
        null
      )
    );
});

// ==================== SERVICE TYPE CRUD ====================

export const saveServiceType = asyncHandler(async (req, res) => {
  const { type } = req.body;

  if (!type) {
    throw new ApiError(400, "TYPE_IS_REQUIRED", req.lang);
  }

  const servType = await serviceType.findOne({ name: type });
  if (servType) {
    throw new ApiError(409, "SERVICE_TYPE_IS_ALREADY_EXISTS", req.lang);
  }

  const saveStatus = await serviceType.create({
    name: type,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "SERVICE_TYPE_IS_CREATED_SUCCESSFULLY",
        req.lang,
        saveStatus
      )
    );
});

export const getServiceTypes = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  const matchStage = {};

  if (req.query.status) {
    matchStage.status = req.query.status;
  }

  if (req.query.search) {
    matchStage.name = {
      $regex: req.query.search,
      $options: "i",
    };
  }

  const allowedSortFields = ["name", "status", "createdAt", "updatedAt"];
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
        types: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              name: 1,
              description: 1,
              status: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ];

  const result = await serviceType.aggregate(aggregation);

  const types = result[0]?.types || [];
  const totalCount = result[0]?.totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      types.length > 0
        ? "SERVICE_TYPES_FETCHED_SUCCESSFULLY"
        : "NO_SERVICE_TYPES_FOUND",
      req.lang,
      types.length > 0
        ? {
            types,
            total_page: totalPages,
            current_page: page,
            total_records: totalCount,
            per_page: limit,
            sort_by: sortBy,
            sort_order: sortOrder === 1 ? "asc" : "desc",
          }
        : null
    )
  );
});

export const getServiceTypeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "INVALID_SERVICE_TYPE_ID", req.lang);
  }

  const servType = await serviceType.findById(id);

  if (!servType) {
    throw new ApiError(404, "SERVICE_TYPE_NOT_FOUND", req.lang);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "SERVICE_TYPE_FETCHED_SUCCESSFULLY",
        req.lang,
        servType
      )
    );
});

export const updateServiceType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type, status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "INVALID_SERVICE_TYPE_ID", req.lang);
  }

  if (!type && !status) {
    throw new ApiError(
      400,
      "AT_LEAST_ONE_FIELD_IS_REQUIRED_TO_UPDATE",
      req.lang
    );
  }

  const servType = await serviceType.findById(id);

  if (!servType) {
    throw new ApiError(404, "SERVICE_TYPE_NOT_FOUND", req.lang);
  }

  if (type) {
    const isTypeExists = await serviceType.findOne({
      name: type,
      _id: { $ne: id },
    });

    if (isTypeExists) {
      throw new ApiError(409, "SERVICE_TYPE_IS_ALREADY_EXISTS", req.lang);
    }

    servType.name = type;
  }

  if (status) {
    servType.status = status;
  }

  await servType.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "SERVICE_TYPE_UPDATED_SUCCESSFULLY",
        req.lang,
        servType
      )
    );
});

export const deleteServiceType = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "INVALID_SERVICE_TYPE_ID", req.lang);
  }

  const servType = await serviceType.findById(id);

  if (!servType) {
    throw new ApiError(404, "SERVICE_TYPE_NOT_FOUND", req.lang);
  }

  await serviceType.findByIdAndDelete(id);

  return res
    .status(200)
    .json(
      new ApiResponse(200, "SERVICE_TYPE_DELETED_SUCCESSFULLY", req.lang, null)
    );
});

// ==================== BUSINESS TYPE CRUD ====================

export const saveBusinessType = asyncHandler(async (req, res) => {
  const { type } = req.body;

  if (!type) {
    throw new ApiError(400, "TYPE_IS_REQUIRED", req.lang);
  }

  const bizType = await businessType.findOne({ name: type });
  if (bizType) {
    throw new ApiError(409, "BUSINESS_TYPE_IS_ALREADY_EXISTS", req.lang);
  }

  const saveStatus = await businessType.create({
    name: type,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "BUSINESS_TYPE_IS_CREATED_SUCCESSFULLY",
        req.lang,
        saveStatus
      )
    );
});

export const getBusinessTypes = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  const matchStage = {};

  if (req.query.status) {
    matchStage.status = req.query.status;
  }

  if (req.query.search) {
    matchStage.name = {
      $regex: req.query.search,
      $options: "i",
    };
  }

  const allowedSortFields = ["name", "status", "createdAt", "updatedAt"];
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
        types: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              name: 1,
              description: 1,
              status: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ];

  const result = await businessType.aggregate(aggregation);

  const types = result[0]?.types || [];
  const totalCount = result[0]?.totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      types.length > 0
        ? "BUSINESS_TYPES_FETCHED_SUCCESSFULLY"
        : "NO_BUSINESS_TYPES_FOUND",
      req.lang,
      types.length > 0
        ? {
            types,
            total_page: totalPages,
            current_page: page,
            total_records: totalCount,
            per_page: limit,
            sort_by: sortBy,
            sort_order: sortOrder === 1 ? "asc" : "desc",
          }
        : null
    )
  );
});

export const getBusinessTypeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "INVALID_BUSINESS_TYPE_ID", req.lang);
  }

  const bizType = await businessType.findById(id);

  if (!bizType) {
    throw new ApiError(404, "BUSINESS_TYPE_NOT_FOUND", req.lang);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "BUSINESS_TYPE_FETCHED_SUCCESSFULLY",
        req.lang,
        bizType
      )
    );
});

export const updateBusinessType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type, status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "INVALID_BUSINESS_TYPE_ID", req.lang);
  }

  if (!type && !status) {
    throw new ApiError(
      400,
      "AT_LEAST_ONE_FIELD_IS_REQUIRED_TO_UPDATE",
      req.lang
    );
  }

  const bizType = await businessType.findById(id);

  if (!bizType) {
    throw new ApiError(404, "BUSINESS_TYPE_NOT_FOUND", req.lang);
  }

  if (type) {
    const isTypeExists = await businessType.findOne({
      name: type,
      _id: { $ne: id },
    });

    if (isTypeExists) {
      throw new ApiError(409, "BUSINESS_TYPE_IS_ALREADY_EXISTS", req.lang);
    }

    bizType.name = type;
  }

  if (status) {
    bizType.status = status;
  }

  await bizType.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "BUSINESS_TYPE_UPDATED_SUCCESSFULLY",
        req.lang,
        bizType
      )
    );
});

export const deleteBusinessType = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "INVALID_BUSINESS_TYPE_ID", req.lang);
  }

  const bizType = await businessType.findById(id);

  if (!bizType) {
    throw new ApiError(404, "BUSINESS_TYPE_NOT_FOUND", req.lang);
  }

  await businessType.findByIdAndDelete(id);

  return res
    .status(200)
    .json(
      new ApiResponse(200, "BUSINESS_TYPE_DELETED_SUCCESSFULLY", req.lang, null)
    );
});

// ==================== CUISINE CRUD ====================

export const saveCuisine = asyncHandler(async (req, res) => {
  const { cuisineName } = req.body;

  if (!cuisineName) {
    throw new ApiError(400, "CUISINE_NAME_IS_REQUIRED", req.lang);
  }

  const cuisineExists = await cuisine.findOne({ name: cuisineName });
  if (cuisineExists) {
    throw new ApiError(409, "CUISINE_IS_ALREADY_EXISTS", req.lang);
  }

  const saveStatus = await cuisine.create({
    name: cuisineName,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "CUISINE_IS_CREATED_SUCCESSFULLY",
        req.lang,
        saveStatus
      )
    );
});

export const getCuisines = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  const matchStage = {};

  if (req.query.status) {
    matchStage.status = req.query.status;
  }

  if (req.query.search) {
    matchStage.name = {
      $regex: req.query.search,
      $options: "i",
    };
  }

  const allowedSortFields = ["name", "status", "createdAt", "updatedAt"];
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
        types: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              name: 1,
              description: 1,
              status: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ];

  const result = await cuisine.aggregate(aggregation);

  const types = result[0]?.types || [];
  const totalCount = result[0]?.totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      types.length > 0 ? "CUISINES_FETCHED_SUCCESSFULLY" : "NO_CUISINES_FOUND",
      req.lang,
      types.length > 0
        ? {
            types,
            total_page: totalPages,
            current_page: page,
            total_records: totalCount,
            per_page: limit,
            sort_by: sortBy,
            sort_order: sortOrder === 1 ? "asc" : "desc",
          }
        : null
    )
  );
});

export const getCuisineById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "INVALID_CUISINE_ID", req.lang);
  }

  const cuisineData = await cuisine.findById(id);

  if (!cuisineData) {
    throw new ApiError(404, "CUISINE_NOT_FOUND", req.lang);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "CUISINE_FETCHED_SUCCESSFULLY",
        req.lang,
        cuisineData
      )
    );
});

export const updateCuisine = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { cuisineName, status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "INVALID_CUISINE_ID", req.lang);
  }

  if (!cuisineName && !status) {
    throw new ApiError(
      400,
      "AT_LEAST_ONE_FIELD_IS_REQUIRED_TO_UPDATE",
      req.lang
    );
  }

  const cuisineData = await cuisine.findById(id);

  if (!cuisineData) {
    throw new ApiError(404, "CUISINE_NOT_FOUND", req.lang);
  }

  if (cuisineName) {
    const isTypeExists = await cuisine.findOne({
      name: cuisineName,
      _id: { $ne: id },
    });

    if (isTypeExists) {
      throw new ApiError(409, "CUISINE_IS_ALREADY_EXISTS", req.lang);
    }

    cuisineData.name = cuisineName;
  }

  if (status) {
    cuisineData.status = status;
  }

  await cuisineData.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "CUISINE_UPDATED_SUCCESSFULLY",
        req.lang,
        cuisineData
      )
    );
});

export const deleteCuisine = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "INVALID_CUISINE_ID", req.lang);
  }

  const cuisineData = await cuisine.findById(id);

  if (!cuisineData) {
    throw new ApiError(404, "CUISINE_NOT_FOUND", req.lang);
  }

  await cuisine.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, "CUISINE_DELETED_SUCCESSFULLY", req.lang, null));
});

// ==================== DISH TYPE CRUD ====================

export const saveDishType = asyncHandler(async (req, res) => {
  const { type } = req.body;

  if (!type) {
    throw new ApiError(400, "TYPE_IS_REQUIRED", req.lang);
  }

  const dishTypeExists = await dishType.findOne({ name: type });
  if (dishTypeExists) {
    throw new ApiError(409, "DISH_TYPE_IS_ALREADY_EXISTS", req.lang);
  }

  const saveStatus = await dishType.create({
    name: type,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "DISH_TYPE_IS_CREATED_SUCCESSFULLY",
        req.lang,
        saveStatus
      )
    );
});

export const getDishTypes = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  const matchStage = {};

  if (req.query.status) {
    matchStage.status = req.query.status;
  }

  if (req.query.search) {
    matchStage.name = {
      $regex: req.query.search,
      $options: "i",
    };
  }

  const allowedSortFields = ["name", "status", "createdAt", "updatedAt"];
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
        types: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              name: 1,
              description: 1,
              status: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ];

  const result = await dishType.aggregate(aggregation);

  const types = result[0]?.types || [];
  const totalCount = result[0]?.totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      types.length > 0
        ? "DISH_TYPES_FETCHED_SUCCESSFULLY"
        : "NO_DISH_TYPES_FOUND",
      req.lang,
      types.length > 0
        ? {
            types,
            total_page: totalPages,
            current_page: page,
            total_records: totalCount,
            per_page: limit,
            sort_by: sortBy,
            sort_order: sortOrder === 1 ? "asc" : "desc",
          }
        : null
    )
  );
});

export const getDishTypeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "INVALID_DISH_TYPE_ID", req.lang);
  }

  const dishTypeData = await dishType.findById(id);

  if (!dishTypeData) {
    throw new ApiError(404, "DISH_TYPE_NOT_FOUND", req.lang);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "DISH_TYPE_FETCHED_SUCCESSFULLY",
        req.lang,
        dishTypeData
      )
    );
});

export const updateDishType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type, status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "INVALID_DISH_TYPE_ID", req.lang);
  }

  if (!type && !status) {
    throw new ApiError(
      400,
      "AT_LEAST_ONE_FIELD_IS_REQUIRED_TO_UPDATE",
      req.lang
    );
  }

  const dishTypeData = await dishType.findById(id);

  if (!dishTypeData) {
    throw new ApiError(404, "DISH_TYPE_NOT_FOUND", req.lang);
  }

  if (type) {
    const isTypeExists = await dishType.findOne({
      name: type,
      _id: { $ne: id },
    });

    if (isTypeExists) {
      throw new ApiError(409, "DISH_TYPE_IS_ALREADY_EXISTS", req.lang);
    }

    dishTypeData.name = type;
  }

  if (status) {
    dishTypeData.status = status;
  }

  await dishTypeData.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "DISH_TYPE_UPDATED_SUCCESSFULLY",
        req.lang,
        dishTypeData
      )
    );
});

export const deleteDishType = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "INVALID_DISH_TYPE_ID", req.lang);
  }

  const dishTypeData = await dishType.findById(id);

  if (!dishTypeData) {
    throw new ApiError(404, "DISH_TYPE_NOT_FOUND", req.lang);
  }

  await dishType.findByIdAndDelete(id);

  return res
    .status(200)
    .json(
      new ApiResponse(200, "DISH_TYPE_DELETED_SUCCESSFULLY", req.lang, null)
    );
});

// ==================== DIET TYPE CRUD ====================

export const saveDietType = asyncHandler(async (req, res) => {
  const { type } = req.body;

  if (!type) {
    throw new ApiError(400, "TYPE_IS_REQUIRED", req.lang);
  }

  const dietTypeExists = await dietType.findOne({ name: type });
  if (dietTypeExists) {
    throw new ApiError(409, "DIET_TYPE_IS_ALREADY_EXISTS", req.lang);
  }

  const saveStatus = await dietType.create({
    name: type,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "DIET_TYPE_IS_CREATED_SUCCESSFULLY",
        req.lang,
        saveStatus
      )
    );
});

export const getDietTypes = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  const matchStage = {};

  if (req.query.status) {
    matchStage.status = req.query.status;
  }

  if (req.query.search) {
    matchStage.name = {
      $regex: req.query.search,
      $options: "i",
    };
  }

  const allowedSortFields = ["name", "status", "createdAt", "updatedAt"];
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
        types: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              name: 1,
              description: 1,
              status: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ];

  const result = await dietType.aggregate(aggregation);

  const types = result[0]?.types || [];
  const totalCount = result[0]?.totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      types.length > 0
        ? "DIET_TYPES_FETCHED_SUCCESSFULLY"
        : "NO_DIET_TYPES_FOUND",
      req.lang,
      types.length > 0
        ? {
            types,
            total_page: totalPages,
            current_page: page,
            total_records: totalCount,
            per_page: limit,
            sort_by: sortBy,
            sort_order: sortOrder === 1 ? "asc" : "desc",
          }
        : null
    )
  );
});

export const getDietTypeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "INVALID_DIET_TYPE_ID", req.lang);
  }

  const dietTypeData = await dietType.findById(id);

  if (!dietTypeData) {
    throw new ApiError(404, "DIET_TYPE_NOT_FOUND", req.lang);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "DIET_TYPE_FETCHED_SUCCESSFULLY",
        req.lang,
        dietTypeData
      )
    );
});

export const updateDietType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type, status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "INVALID_DIET_TYPE_ID", req.lang);
  }

  if (!type && !status) {
    throw new ApiError(
      400,
      "AT_LEAST_ONE_FIELD_IS_REQUIRED_TO_UPDATE",
      req.lang
    );
  }

  const dietTypeData = await dietType.findById(id);

  if (!dietTypeData) {
    throw new ApiError(404, "DIET_TYPE_NOT_FOUND", req.lang);
  }

  if (type) {
    const isTypeExists = await dietType.findOne({
      name: type,
      _id: { $ne: id },
    });

    if (isTypeExists) {
      throw new ApiError(409, "DIET_TYPE_IS_ALREADY_EXISTS", req.lang);
    }

    dietTypeData.name = type;
  }

  if (status) {
    dietTypeData.status = status;
  }

  await dietTypeData.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "DIET_TYPE_UPDATED_SUCCESSFULLY",
        req.lang,
        dietTypeData
      )
    );
});

export const deleteDietType = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "INVALID_DIET_TYPE_ID", req.lang);
  }

  const dietTypeData = await dietType.findById(id);

  if (!dietTypeData) {
    throw new ApiError(404, "DIET_TYPE_NOT_FOUND", req.lang);
  }

  await dietType.findByIdAndDelete(id);

  return res
    .status(200)
    .json(
      new ApiResponse(200, "DIET_TYPE_DELETED_SUCCESSFULLY", req.lang, null)
    );
});

export const restaurantRegistration = asyncHandler(async (req, res) => {
  throw new ApiError(400, "TESTING", req.lang);
});

export const getAllRestaurant = asyncHandler(async (req, res) => {
  const lang = req.lang;

  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  const matchStage = {};

  if (req.query.status) {
    matchStage.status = req.query.status;
  }

  if (req.query.isDeleted) {
    matchStage.isDeleted = req.query.isDeleted === "true";
  }

  if (req.query.search) {
    matchStage.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } },
      { phone: { $regex: req.query.search, $options: "i" } },
      { restaurantId: { $regex: req.query.search, $options: "i" } }
    ];
  }

  // Additional filter options
  if (req.query.restaurantType) {
    matchStage.restaurantType = new mongoose.Types.ObjectId(req.query.restaurantType);
  }

  if (req.query.cuisine) {
    matchStage.cuisine = new mongoose.Types.ObjectId(req.query.cuisine);
  }

  if (req.query.city) {
    matchStage["address.city"] = { $regex: req.query.city, $options: "i" };
  }

  if (req.query.isDeliveryService) {
    matchStage.isDeliveryService = req.query.isDeliveryService === "true";
  }

  if (req.query.isFoodPickUP) {
    matchStage.isFoodPickUP = req.query.isFoodPickUP === "true";
  }

  if (req.query.isVerified) {
    matchStage.isVerified = req.query.isVerified === "true";
  }

  const allowedSortFields = [
    "name",
    "status",
    "createdAt",
    "updatedAt",
    "isDeleted",
    "restaurantId"
  ];

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

    // Owner lookup
    {
      $lookup: {
        from: "users",
        localField: "ownerId",
        foreignField: "_id",
        as: "owner"
      }
    },

    {
      $unwind: {
        path: "$owner",
        preserveNullAndEmptyArrays: true
      }
    },

    // Restaurant Type lookup
    {
      $lookup: {
        from: "restauranttypes",
        localField: "restaurantType",
        foreignField: "_id",
        as: "restaurantTypeDetails"
      }
    },

    {
      $unwind: {
        path: "$restaurantTypeDetails",
        preserveNullAndEmptyArrays: true
      }
    },

    // Service Type lookup
    {
      $lookup: {
        from: "servicetypes",
        localField: "serviceType",
        foreignField: "_id",
        as: "serviceTypeDetails"
      }
    },

    {
      $unwind: {
        path: "$serviceTypeDetails",
        preserveNullAndEmptyArrays: true
      }
    },

    // Business Type lookup
    {
      $lookup: {
        from: "businesstypes",
        localField: "businessType",
        foreignField: "_id",
        as: "businessTypeDetails"
      }
    },

    {
      $unwind: {
        path: "$businessTypeDetails",
        preserveNullAndEmptyArrays: true
      }
    },

    // Cuisine lookup
    {
      $lookup: {
        from: "cuisines",
        localField: "cuisine",
        foreignField: "_id",
        as: "cuisineDetails"
      }
    },

    {
      $unwind: {
        path: "$cuisineDetails",
        preserveNullAndEmptyArrays: true
      }
    },

    // Dish Type lookup
    {
      $lookup: {
        from: "dishtypes",
        localField: "dishType",
        foreignField: "_id",
        as: "dishTypeDetails"
      }
    },

    {
      $unwind: {
        path: "$dishTypeDetails",
        preserveNullAndEmptyArrays: true
      }
    },

    // Diet Type lookup
    {
      $lookup: {
        from: "diettypes",
        localField: "dietType",
        foreignField: "_id",
        as: "dietTypeDetails"
      }
    },

    {
      $unwind: {
        path: "$dietTypeDetails",
        preserveNullAndEmptyArrays: true
      }
    },

    {
      $facet: {
        restaurants: [
          { $skip: skip },
          { $limit: limit },

          {
            $project: {
              // Basic Information
              restaurantId: 1,
              name: 1,
              description: 1,
              email: 1,
              phone: 1,
              
              // Location
              latitude: 1,
              longitude: 1,
              locationPoint: 1,
              address: 1,

              // Restaurant Categories
              restaurantType: {
                _id: "$restaurantTypeDetails._id",
                name: "$restaurantTypeDetails.name"
              },
              serviceType: {
                _id: "$serviceTypeDetails._id",
                name: "$serviceTypeDetails.name"
              },
              businessType: {
                _id: "$businessTypeDetails._id",
                name: "$businessTypeDetails.name"
              },
              cuisine: {
                _id: "$cuisineDetails._id",
                name: "$cuisineDetails.name"
              },
              dishType: {
                _id: "$dishTypeDetails._id",
                name: "$dishTypeDetails.name"
              },
              dietType: {
                _id: "$dietTypeDetails._id",
                name: "$dietTypeDetails.name"
              },

              // Hours & Services
              openingHours: 1,
              holidayInfotext: 1,
              
              isDeliveryService: 1,
              deliveryHours: 1,
              deliveryInfotext: 1,
              
              isFoodPickUP: 1,
              foodPickupHours: 1,
              foodPickupInfoText: 1,

              // Payment & Display
              advancePayment: 1,
              generatedQRCode: 1,
              displayOnMap: 1,
              displayDishesMenu: 1,

              // Owner Information
              owner: {
                _id: "$owner._id",
                firstName: "$owner.firstName",
                lastName: "$owner.lastName",
                email: "$owner.email",
                phone: "$owner.phone"
              },

              // Status & Metadata
              status: 1,
              isVerified: 1,
              isDeleted: 1,
              deletedAt: 1,
              createdAt: 1,
              updatedAt: 1
            }
          }
        ],

        totalCount: [{ $count: "count" }]
      }
    }
  ];

  const result = await Restaurant.aggregate(aggregation);

  const restaurants = result[0]?.restaurants || [];
  const totalCount = result[0]?.totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      restaurants.length > 0
        ? "RESTAURANTS_FETCHED_SUCCESSFULLY"
        : "NO_RESTAURANTS_FOUND",
      lang,
      restaurants.length > 0
        ? {
            restaurants,
            total_page: totalPages,
            current_page: page,
            total_records: totalCount,
            per_page: limit,
            sort_by: sortBy,
            sort_order: sortOrder === 1 ? "asc" : "desc",
          }
        : null
    )
  );
});

