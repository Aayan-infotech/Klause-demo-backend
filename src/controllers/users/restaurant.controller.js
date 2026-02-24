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
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import { uploadBase64ToS3 } from "../../utils/s3.utils.js";
import Menu from "../../models/menu.model.js";
import { validateTimingSections } from "../../utils/validateTimingSections.js";

export const getRestaurantTypes = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  const matchStage = {
    status: "active",
  };

  if (req.query.search) {
    matchStage.name = {
      $regex: req.query.search,
      $options: "i",
    };
  }

  const sortStage = {
    ["createdAt"]: -1,
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
          }
        : null
    )
  );
});

export const getServiceTypes = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  const matchStage = {
    status: "active",
  };

  const sortStage = {
    ["createdAt"]: -1,
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
          }
        : null
    )
  );
});

export const getBusinessTypes = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  const matchStage = {
    status: "active",
  };

  const sortStage = {
    ["createdAt"]: -1,
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
          }
        : null
    )
  );
});

export const getCuisines = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  const matchStage = {
    status: "active",
  };

  const sortStage = {
    ["createdAt"]: -1,
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
          }
        : null
    )
  );
});

export const getDishTypes = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  const matchStage = {
    status: "active",
  };

  const sortStage = {
    ["createdAt"]: -1,
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
          }
        : null
    )
  );
});

export const getDietTypes = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  const matchStage = {
    status: "active",
  };

  const sortStage = {
    ["createdAt"]: -1,
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
          }
        : null
    )
  );
});

export const registerRestaurant = asyncHandler(async (req, res) => {
  const lang = req.lang;
  const {
    name,
    restaurantTypes,
    serviceTypes,
    businessTypes,
    cuisines,
    dishTypes,
    dietTypes,
    description,
    email,
    phone,
    latitude,
    longitude,
    street,
    No,
    postCode,
    city,
    country,
  } = req.body;
  const ownerId = req.user._id;

  // Check if restaurant already exists
  const existingRestaurant = await Restaurant.findOne({
    $or: [{ email }, { phone }],
  });

  if (existingRestaurant) {
    throw new ApiError(409, "RESTAURANT_ALREADY_EXISTS", lang);
  }

  // Generate unique restaurant ID
  const restaurantId = `REST-${uuidv4().substring(0, 8).toUpperCase()}`;

  // Generate QR Code
  const qrCodeData = JSON.stringify({
    restaurantId,
    name,
    phone,
    email,
  });
  const qrCodeImage = await QRCode.toDataURL(qrCodeData);

  const uploadQRCode = await uploadBase64ToS3(qrCodeImage);

  if (!uploadQRCode) {
    throw new ApiError(500, "QR_CODE_UPLOAD_FAILED", req.lang);
  }

  // Create restaurant
  const restaurant = await Restaurant.create({
    restaurantId,
    name,
    restaurantType: restaurantTypes,
    serviceType: serviceTypes,
    businessType: businessTypes,
    cuisine: cuisines,
    dishType: dishTypes,
    dietType: dietTypes,
    description,
    email,
    phone,
    latitude,
    longitude,
    locationPoint: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
    address: {
      street: street,
      No: No,
      postCode: postCode,
      city: city,
      country: country,
    },
    generatedQRCode: uploadQRCode,
    ownerId,
  });

  return res.status(201).json(
    new ApiResponse(201, "RESTAURANT_CREATED_SUCCESSFULLY", req.lang, {
      restaurantId: restaurant.restaurantId,
      _id: restaurant._id,
    })
  );
});

export const getRestaurants = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  const aggregation = [];

  aggregation.push({
    $match: {
      ownerId: new mongoose.Types.ObjectId(req.user._id),
      isDeleted: { $ne: true },
    },
  });

  // Sort latest first
  aggregation.push({
    $sort: { createdAt: -1 },
  });

  aggregation.push({
    $facet: {
      restaurants: [
        { $skip: skip },
        { $limit: limit },

        // Lookup Menus and count
        {
          $lookup: {
            from: "menus",
            localField: "_id",
            foreignField: "restaurantId",
            as: "menus",
          },
        },
        {
          $addFields: {
            totalMenus: { $size: "$menus" },
          },
        },

        // Lookup Assigned Managers and count
        {
          $lookup: {
            from: "managers",
            localField: "_id",
            foreignField: "restaurantId",
            as: "managers",
          },
        },
        {
          $addFields: {
            totalManagers: { $size: "$managers" },
          },
        },

        // Final Projection
        {
          $project: {
            restaurantId: 1,
            name: 1,
            email: 1,
            phone: 1,
            address: 1,
            status: 1,

            totalMenus: 1,
            totalManagers: 1,
          },
        },
      ],

      totalCount: [{ $count: "count" }],
    },
  });

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
      req.lang,
      restaurants.length > 0
        ? {
            restaurants,
            total_page: totalPages,
            current_page: page,
            total_records: totalCount,
            per_page: limit,
          }
        : null
    )
  );
});

export const updateTiming = async (req, res) => {
  const { restaurantId } = req.params;
  const ownerId = req.user._id;

  const {
    openingHours,
    additionalInfo,
    isDeliveryService,
    isDeliveryHoursSameAsOpeningHours,
    deliveryHours,
    additionalDeliveryInfo,
    isFoodPickUP,
    isFoodPickupHoursSameAsOpeningHours,
    foodPickupHours,
    additionalFoodPickupInfo,
  } = req.body;

  validateTimingSections(req.body, req.lang, ApiError);

  const restaurant = await Restaurant.findOne({
    _id: restaurantId,
    ownerId,
    isDeleted: false,
  });

  if (!restaurant) {
    throw new ApiError(404, "RESTAURANT_NOT_FOUND", req.lang);
  }

  const updatePayload = {
    openingHours,
    additionalInfo: additionalInfo ?? "",
    isDeliveryService,
    isDeliveryHoursSameAsOpeningHours,
    additionalDeliveryInfo: additionalDeliveryInfo ?? "",
    isFoodPickUP,
    isFoodPickupHoursSameAsOpeningHours,
    additionalFoodPickupInfo: additionalFoodPickupInfo ?? "",

    deliveryHours:
      isDeliveryService && !isDeliveryHoursSameAsOpeningHours
        ? deliveryHours
        : [],

    foodPickupHours:
      isFoodPickUP && !isFoodPickupHoursSameAsOpeningHours
        ? foodPickupHours
        : [],
  };

  const updated = await Restaurant.findByIdAndUpdate(
    restaurantId,
    { $set: updatePayload },
    { new: true, runValidators: true }
  ).select(
    `openingHours additionalInfo
       isDeliveryService isDeliveryHoursSameAsOpeningHours deliveryHours additionalDeliveryInfo
       isFoodPickUP isFoodPickupHoursSameAsOpeningHours foodPickupHours additionalFoodPickupInfo`
  );

  return res.status(200).json({
    success: true,
    message: "TIMING_UPDATED_SUCCESSFULLY",
    data: updated,
  });
};

export const completeRestaurantStep3 = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const ownerId = req.user._id;

  const {
    restaurntId,
    advancePayment,
    displayOnMap,
    displayDishesMenu,
    specificMenuId,
  } = req.body;

  const restaurant = await Restaurant.findOne({
    _id: restaurantId,
    ownerId,
    isDeleted: false,
  });

  if (!restaurant) {
    throw new ApiError(404, "RESTAURANT_NOT_FOUND", req.lang);
  }

  if (displayDishesMenu === "showSpecificMenu") {
    if (!specificMenuId) {
      throw new ApiError(400, "FIELD_REQUIRED", req.lang, {
        field: "specificMenuId",
      });
    }
  }

  // if there is a change in the restaurant Id generated QR code should be updated
  if (restaurant.restaurantId !== restaurntId) {
    const existingRestaurant = await Restaurant.findOne({
      restaurantId: restaurntId,
    });

    if (existingRestaurant) {
      throw new ApiError(409, "RESTAURANT_ID_ALREADY_EXISTS", req.lang);
    }

    const qrCodeData = JSON.stringify({
      restaurantId: restaurntId,
      name: restaurant.name,
      phone: restaurant.phone,
      email: restaurant.email,
    });
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);
    const uploadQRCode = await uploadBase64ToS3(qrCodeImage);

    if (!uploadQRCode) {
      throw new ApiError(500, "QR_CODE_UPLOAD_FAILED", req.lang);
    }
    restaurant.restaurantId = restaurntId;
    restaurant.generatedQRCode = uploadQRCode;
  }

  restaurant.advancePayment = advancePayment;
  restaurant.displayOnMap = displayOnMap;
  restaurant.displayDishesMenu = displayDishesMenu;
  restaurant.specificMenuId = specificMenuId;

  const updatedRestaurant = await restaurant.save();

  return res.status(200).json({
    success: true,
    message: "RESTAURANT_REGISTRATION_SUCCESSFULLY",
    data: updatedRestaurant,
  });
});

export const updateRestaurant = asyncHandler(async (req, res) => {
  const lang = req.lang;
  const { restaurantId } = req.params;
  const ownerId = req.user._id;

  const {
    name,
    restaurantTypes,
    serviceTypes,
    businessTypes,
    cuisines,
    dishTypes,
    dietTypes,
    description,
    email,
    phone,
    latitude,
    longitude,
    address,
    openingHours,
    holidayInfotext,
    isDeliveryService,
    deliveryHours,
    deliveryInfotext,
    isFoodPickUP,
    foodPickupHours,
    foodPickupInfoText,
    advancePayment,
    displayOnMap,
    displayDishesMenu,
  } = req.body;

  // Find restaurant by ID
  const restaurant = await Restaurant.findOne({
    _id: restaurantId,
    ownerId,
  });

  if (!restaurant) {
    throw new ApiError(404, "RESTAURANT_NOT_FOUND", lang);
  }

  // Check if email or phone is being updated and if it conflicts with another restaurant
  if (email || phone) {
    const conflictQuery = {
      _id: { $ne: restaurantId },
      $or: [],
    };

    if (email && email !== restaurant.email) {
      conflictQuery.$or.push({ email });
    }

    if (phone && phone !== restaurant.phone) {
      conflictQuery.$or.push({ phone });
    }

    if (conflictQuery.$or.length > 0) {
      const existingRestaurant = await Restaurant.findOne(conflictQuery);
      if (existingRestaurant) {
        throw new ApiError(409, "EMAIL_OR_PHONE_ALREADY_EXISTS", lang);
      }
    }
  }

  // Validate referenced documents if they are being updated
  const validationPromises = [];

  if (restaurantTypes) {
    validationPromises.push(
      restaurantType.findById(restaurantTypes).then((doc) => {
        if (!doc) throw new ApiError(404, "RESTAURANT_TYPE_NOT_FOUND", lang);
        return doc;
      })
    );
  }

  if (serviceTypes) {
    validationPromises.push(
      serviceType.findById(serviceTypes).then((doc) => {
        if (!doc) throw new ApiError(404, "SERVICE_TYPE_NOT_FOUND", lang);
        return doc;
      })
    );
  }

  if (businessTypes) {
    validationPromises.push(
      businessType.findById(businessTypes).then((doc) => {
        if (!doc) throw new ApiError(404, "BUSINESS_TYPE_NOT_FOUND", lang);
        return doc;
      })
    );
  }

  if (cuisines) {
    validationPromises.push(
      cuisine.findById(cuisines).then((doc) => {
        if (!doc) throw new ApiError(404, "CUISINE_NOT_FOUND", lang);
        return doc;
      })
    );
  }

  if (dishTypes) {
    validationPromises.push(
      dishType.findById(dishTypes).then((doc) => {
        if (!doc) throw new ApiError(404, "DISH_TYPE_NOT_FOUND", lang);
        return doc;
      })
    );
  }

  if (dietTypes) {
    validationPromises.push(
      dietType.findById(dietTypes).then((doc) => {
        if (!doc) throw new ApiError(404, "DIET_TYPE_NOT_FOUND", lang);
        return doc;
      })
    );
  }

  // Wait for all validations
  if (validationPromises.length > 0) {
    await Promise.all(validationPromises);
  }

  // Prepare update data object
  const updateData = {};

  // Update basic fields
  if (name !== undefined) updateData.name = name;
  if (restaurantTypes !== undefined)
    updateData.restaurantType = restaurantTypes;
  if (serviceTypes !== undefined) updateData.serviceType = serviceTypes;
  if (businessTypes !== undefined) updateData.businessType = businessTypes;
  if (cuisines !== undefined) updateData.cuisine = cuisines;
  if (dishTypes !== undefined) updateData.dishType = dishTypes;
  if (dietTypes !== undefined) updateData.dietType = dietTypes;
  if (description !== undefined) updateData.description = description;
  if (email !== undefined) updateData.email = email;
  if (phone !== undefined) updateData.phone = phone;
  if (address !== undefined) updateData.address = address;

  // Update location if latitude or longitude changed
  if (latitude !== undefined || longitude !== undefined) {
    const newLatitude = latitude !== undefined ? latitude : restaurant.latitude;
    const newLongitude =
      longitude !== undefined ? longitude : restaurant.longitude;

    updateData.latitude = newLatitude;
    updateData.longitude = newLongitude;
    updateData.locationPoint = {
      type: "Point",
      coordinates: [newLongitude, newLatitude],
    };
  }

  // Update opening hours and related fields
  if (openingHours !== undefined) updateData.openingHours = openingHours;
  if (holidayInfotext !== undefined)
    updateData.holidayInfotext = holidayInfotext;

  // Update delivery service fields
  if (isDeliveryService !== undefined) {
    updateData.isDeliveryService = isDeliveryService;

    // If delivery service is disabled, clear delivery hours
    if (!isDeliveryService) {
      updateData.deliveryHours = [];
      updateData.deliveryInfotext = "";
    }
  }

  if (deliveryHours !== undefined) updateData.deliveryHours = deliveryHours;
  if (deliveryInfotext !== undefined)
    updateData.deliveryInfotext = deliveryInfotext;

  // Update food pickup fields
  if (isFoodPickUP !== undefined) {
    updateData.isFoodPickUP = isFoodPickUP;

    // If food pickup is disabled, clear pickup hours
    if (!isFoodPickUP) {
      updateData.foodPickupHours = [];
      updateData.foodPickupInfoText = "";
    }
  }

  if (foodPickupHours !== undefined)
    updateData.foodPickupHours = foodPickupHours;
  if (foodPickupInfoText !== undefined)
    updateData.foodPickupInfoText = foodPickupInfoText;

  // Update other fields
  if (advancePayment !== undefined) updateData.advancePayment = advancePayment;
  if (displayOnMap !== undefined) updateData.displayOnMap = displayOnMap;
  if (displayDishesMenu !== undefined)
    updateData.displayDishesMenu = displayDishesMenu;

  // Update the restaurant
  const updatedRestaurant = await Restaurant.findByIdAndUpdate(
    restaurantId,
    { $set: updateData },
    {
      new: true,
      runValidators: true,
    }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "RESTAURANT_UPDATED_SUCCESSFULLY",
        lang,
        updatedRestaurant
      )
    );
});
export const deleteRestaurant = asyncHandler(async (req, res) => {
  const lang = req.lang;
  const { restaurantId } = req.params;
  const ownerId = req.user._id;

  // Validate restaurantId
  if (!restaurantId) {
    throw new ApiError(400, "RESTAURANT_ID_REQUIRED", lang);
  }

  // Check if any menu exists for this restaurant by this owner
  const hasMenu = await Menu.findOne({ restaurantId, createdBy: ownerId });
  if (hasMenu) {
    throw new ApiError(400, "YOU_CANT_DELETE_THE_RESTAURANT_IT_HAS_MENU", lang);
  }

  // Find restaurant
  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    throw new ApiError(404, "RESTAURANT_NOT_FOUND", lang);
  }

  // Check ownership
  if (restaurant.ownerId.toString() !== ownerId.toString()) {
    throw new ApiError(403, "UNAUTHORIZED_TO_DELETE_THIS_RESTAURANT", lang);
  }

  restaurant.isDeleted = true;
  restaurant.deletedAt = new Date();
  await restaurant.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "RESTAURANT_DELETED_SUCCESSFULLY", lang));
});

export const TrashRestaurant = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  const aggregation = [];

  aggregation.push({
    $match: {
      ownerId: new mongoose.Types.ObjectId(req.user._id),
      isDeleted: { $eq: true },
    },
  });

  // Sort latest first
  aggregation.push({
    $sort: { createdAt: -1 },
  });

  aggregation.push({
    $facet: {
      restaurants: [
        { $skip: skip },
        { $limit: limit },

        // Lookup Menus and count
        {
          $lookup: {
            from: "menus",
            localField: "_id",
            foreignField: "restaurantId",
            as: "menus",
          },
        },
        {
          $addFields: {
            totalMenus: { $size: "$menus" },
          },
        },

        // Lookup Assigned Managers and count
        {
          $lookup: {
            from: "managers",
            localField: "_id",
            foreignField: "restaurantId",
            as: "managers",
          },
        },
        {
          $addFields: {
            totalManagers: { $size: "$managers" },
          },
        },

        // Final Projection
        {
          $project: {
            restaurantId: 1,
            name: 1,
            email: 1,
            phone: 1,
            address: 1,
            status: 1,
            deletedAt: 1,

            totalMenus: 1,
            totalManagers: 1,
          },
        },
      ],

      totalCount: [{ $count: "count" }],
    },
  });

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
      req.lang,
      restaurants.length > 0
        ? {
            restaurants,
            total_page: totalPages,
            current_page: page,
            total_records: totalCount,
            per_page: limit,
          }
        : null
    )
  );
});

export const statusUpdate = asyncHandler(async (req, res) => {
  const lang = req.lang;
  const { restaurantId } = req.params;
  const { type } = req.body;
  const ownerId = req.user._id;

  if (!restaurantId) {
    throw new ApiError(400, "RESTAURANT_ID_REQUIRED", lang);
  }

  if (!type) {
    throw new ApiError(400, "TYPE_REQUIRED", lang);
  }
  if (!["restore", "permanent_delete"].includes(type)) {
    throw new ApiError(400, "INVALID_TYPE", lang);
  }

  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    throw new ApiError(404, "RESTAURANT_NOT_FOUND", lang);
  }

  // ownership check
  if (restaurant.ownerId.toString() !== ownerId.toString()) {
    throw new ApiError(403, "UNAUTHORIZED", lang);
  }

  // -------- RESTORE FROM TRASH --------
  if (type === "restore") {
    if (!restaurant.isDeleted) {
      throw new ApiError(400, "RESTAURANT_IS_NOT_IN_TRASH", lang);
    }

    restaurant.isDeleted = false;
    restaurant.deletedAt = null;

    await restaurant.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "RESTAURANT_RESTORED_SUCCESSFULLY",
          lang,
          restaurant
        )
      );
  }

  // -------- PERMANENT DELETE --------
  if (type === "permanent_delete") {
    if (!restaurant.isDeleted) {
      throw new ApiError(
        400,
        "ONLY_TRASHED_RESTAURANT_CAN_BE_PERMANENTLY_DELETED",
        lang
      );
    }

    // Optional: you can delete related data here (images, settings etc)

    await Restaurant.findByIdAndDelete(restaurantId);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "RESTAURANT_PERMANENTLY_DELETED_SUCCESSFULLY",
          lang,
          null
        )
      );
  }

  throw new ApiError(400, "INVALID_TYPE", lang);
});

export const getRestaurantDetails = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;

  if (!restaurantId) {
    throw new ApiError(400, "RESTAURANT_ID_IS_REQUIRED", req.lang);
  }

  if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
    throw new ApiError(400, "INVALID_RESTAURANT_ID", req.lang);
  }

  const [restaurantDetails] = await Restaurant.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(restaurantId),
        isDeleted: { $ne: true },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "ownerId",
        foreignField: "_id",
        as: "owner",
        pipeline: [{ $project: { name: 1, email: 1, phone: 1 } }],
      },
    },
    { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "restauranttypes",
        localField: "restaurantType",
        foreignField: "_id",
        as: "restaurantType",
        pipeline: [{ $project: { name: 1 } }],
      },
    },
    {
      $lookup: {
        from: "servicetypes",
        localField: "serviceType",
        foreignField: "_id",
        as: "serviceType",
        pipeline: [{ $project: { name: 1 } }],
      },
    },
    {
      $lookup: {
        from: "businesstypes",
        localField: "businessType",
        foreignField: "_id",
        as: "businessType",
        pipeline: [{ $project: { name: 1 } }],
      },
    },
    {
      $lookup: {
        from: "cuisines",
        localField: "cuisine",
        foreignField: "_id",
        as: "cuisine",
        pipeline: [{ $project: { name: 1 } }],
      },
    },
    {
      $lookup: {
        from: "dishtypes",
        localField: "dishType",
        foreignField: "_id",
        as: "dishType",
        pipeline: [{ $project: { name: 1 } }],
      },
    },
    {
      $lookup: {
        from: "diettypes",
        localField: "dietType",
        foreignField: "_id",
        as: "dietType",
        pipeline: [{ $project: { name: 1 } }],
      },
    },
    {
       $project: {
        // basic info
        _id:1,
        name: 1,
        restaurantId: 1,
        description: 1,
        email: 1,
        phone: 1,
        status: 1,
        isVerified: 1,

        // location
        latitude: 1,
        longitude: 1,
        address: 1,
        locationPoint: 1,

        // flags
        payment: 1,
        displayOnMap: 1,
        displayDishesMenu: 1,
        isDeliveryService: 1,
        isFoodPickUP: 1,

        // relations
        restaurantType: 1,
        serviceType: 1,
        businessType: 1,
        cuisine: 1,
        dishType: 1,
        dietType: 1,
        owner: 1,

        // hours
        openingHours: 1,
        deliveryHours: 1,
        foodPickupHours: 1,

        // computed
        isDeliveryHoursSameAsOpeningHours:1,
        isFoodPickupHoursSameAsOpeningHours:1,

        // media
        restaurantImages: 1,
        generatedQRCode: 1,

        // timestamps
        createdAt: 1,
        updatedAt: 1,
      },
    }
  ]);

  if (!restaurantDetails) {
    throw new ApiError(404, "RESTAURANT_NOT_FOUND", req.lang);
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      "RESTAURANT_DETAILS_FETCHED_SUCCESSFULLY",
      req.lang,
      restaurantDetails
    )
  );
});
