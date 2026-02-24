import Joi from "joi";

// ==================== RESTAURANT TYPE VALIDATION ====================
export const restaurantTypeValidationSchema = Joi.object({
  type: Joi.string().trim().min(2).max(100).required().messages({
    "string.base": "TYPE_MUST_BE_STRING",
    "string.empty": "TYPE_CANNOT_BE_EMPTY",
    "string.min": "TYPE_MIN_LENGTH_2",
    "string.max": "TYPE_MAX_LENGTH_100",
    "any.required": "TYPE_IS_REQUIRED",
  }),
});

export const updateRestaurantTypeValidationSchema = Joi.object({
  type: Joi.string().trim().min(2).max(100).optional().messages({
    "string.base": "TYPE_MUST_BE_STRING",
    "string.empty": "TYPE_CANNOT_BE_EMPTY",
    "string.min": "TYPE_MIN_LENGTH_2",
    "string.max": "TYPE_MAX_LENGTH_100",
  }),
  status: Joi.string().valid("active", "inactive").optional().messages({
    "string.base": "STATUS_MUST_BE_STRING",
    "any.only": "STATUS_MUST_BE_ACTIVE_OR_INACTIVE",
  }),
}).min(1);

// ==================== SERVICE TYPE VALIDATION ====================
export const serviceTypeValidationSchema = Joi.object({
  type: Joi.string().trim().min(2).max(100).required().messages({
    "string.base": "TYPE_MUST_BE_STRING",
    "string.empty": "TYPE_CANNOT_BE_EMPTY",
    "string.min": "TYPE_MIN_LENGTH_2",
    "string.max": "TYPE_MAX_LENGTH_100",
    "any.required": "TYPE_IS_REQUIRED",
  }),
});

export const updateServiceTypeValidationSchema = Joi.object({
  type: Joi.string().trim().min(2).max(100).optional().messages({
    "string.base": "TYPE_MUST_BE_STRING",
    "string.empty": "TYPE_CANNOT_BE_EMPTY",
    "string.min": "TYPE_MIN_LENGTH_2",
    "string.max": "TYPE_MAX_LENGTH_100",
  }),
  status: Joi.string().valid("active", "inactive").optional().messages({
    "string.base": "STATUS_MUST_BE_STRING",
    "any.only": "STATUS_MUST_BE_ACTIVE_OR_INACTIVE",
  }),
}).min(1);

// ==================== BUSINESS TYPE VALIDATION ====================
export const businessTypeValidationSchema = Joi.object({
  type: Joi.string().trim().min(2).max(100).required().messages({
    "string.base": "TYPE_MUST_BE_STRING",
    "string.empty": "TYPE_CANNOT_BE_EMPTY",
    "string.min": "TYPE_MIN_LENGTH_2",
    "string.max": "TYPE_MAX_LENGTH_100",
    "any.required": "TYPE_IS_REQUIRED",
  }),
});

export const updateBusinessTypeValidationSchema = Joi.object({
  type: Joi.string().trim().min(2).max(100).optional().messages({
    "string.base": "TYPE_MUST_BE_STRING",
    "string.empty": "TYPE_CANNOT_BE_EMPTY",
    "string.min": "TYPE_MIN_LENGTH_2",
    "string.max": "TYPE_MAX_LENGTH_100",
  }),
  status: Joi.string().valid("active", "inactive").optional().messages({
    "string.base": "STATUS_MUST_BE_STRING",
    "any.only": "STATUS_MUST_BE_ACTIVE_OR_INACTIVE",
  }),
}).min(1);

// ==================== CUISINE VALIDATION ====================
export const cuisineValidationSchema = Joi.object({
  cuisineName: Joi.string().trim().min(2).max(100).required().messages({
    "string.base": "FIELD_MUST_BE_STRING",
    "string.empty": "FIELD_REQUIRED",
    "string.min": "FIELD_MIN_LENGTH",
    "string.max": "FIELD_MAX_LENGTH",
    "any.required": "FIELD_REQUIRED",
  }),
});

export const updateCuisineValidationSchema = Joi.object({
  cuisineName: Joi.string().trim().min(2).max(100).optional().messages({
    "string.base": "FIELD_MUST_BE_STRING",
    "string.empty": "FIELD_REQUIRED",
    "string.min": "FIELD_MIN_LENGTH",
    "string.max": "FIELD_MAX_LENGTH",
  }),
  status: Joi.string().valid("active", "inactive").optional().messages({
    "string.base": "STATUS_MUST_BE_STRING",
    "any.only": "STATUS_MUST_BE_ACTIVE_OR_INACTIVE",
  }),
}).min(1);

// ==================== DISH TYPE VALIDATION ====================
export const dishTypeValidationSchema = Joi.object({
  type: Joi.string().trim().min(2).max(100).required().messages({
    "string.base": "TYPE_MUST_BE_STRING",
    "string.empty": "TYPE_CANNOT_BE_EMPTY",
    "string.min": "TYPE_MIN_LENGTH_2",
    "string.max": "TYPE_MAX_LENGTH_100",
    "any.required": "TYPE_IS_REQUIRED",
  }),
});

export const updateDishTypeValidationSchema = Joi.object({
  type: Joi.string().trim().min(2).max(100).optional().messages({
    "string.base": "TYPE_MUST_BE_STRING",
    "string.empty": "TYPE_CANNOT_BE_EMPTY",
    "string.min": "TYPE_MIN_LENGTH_2",
    "string.max": "TYPE_MAX_LENGTH_100",
  }),
  status: Joi.string().valid("active", "inactive").optional().messages({
    "string.base": "STATUS_MUST_BE_STRING",
    "any.only": "STATUS_MUST_BE_ACTIVE_OR_INACTIVE",
  }),
}).min(1);

// ==================== DIET TYPE VALIDATION ====================
export const dietTypeValidationSchema = Joi.object({
  type: Joi.string().trim().min(2).max(100).required().messages({
    "string.base": "TYPE_MUST_BE_STRING",
    "string.empty": "TYPE_CANNOT_BE_EMPTY",
    "string.min": "TYPE_MIN_LENGTH_2",
    "string.max": "TYPE_MAX_LENGTH_100",
    "any.required": "TYPE_IS_REQUIRED",
  }),
});

export const updateDietTypeValidationSchema = Joi.object({
  type: Joi.string().trim().min(2).max(100).optional().messages({
    "string.base": "TYPE_MUST_BE_STRING",
    "string.empty": "TYPE_CANNOT_BE_EMPTY",
    "string.min": "TYPE_MIN_LENGTH_2",
    "string.max": "TYPE_MAX_LENGTH_100",
  }),
  status: Joi.string().valid("active", "inactive").optional().messages({
    "string.base": "STATUS_MUST_BE_STRING",
    "any.only": "STATUS_MUST_BE_ACTIVE_OR_INACTIVE",
  }),
}).min(1);

// ======================Restaurant =============================

// Main Restaurant Registration Validation Schema
export const registrationRestaurantSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.base": "FIELD_MUST_BE_STRING",
    "string.empty": "FIELD_REQUIRED",
    "string.min": "FIELD_MIN_LENGTH",
    "string.max": "FIELD_MAX_LENGTH",
    "any.required": "FIELD_REQUIRED",
  }),

  restaurantTypes: Joi.array()
    .items(Joi.string().hex().length(24))
    .min(1)
    .required()
    .messages({
      "any.required": "FIELD_REQUIRED",
    }),

  serviceTypes: Joi.array()
    .items(Joi.string().hex().length(24))
    .min(1)
    .required()
    .messages({
      "any.required": "FIELD_REQUIRED",
    }),

  businessTypes: Joi.array()
    .items(Joi.string().hex().length(24))
    .min(1)
    .required()
    .messages({
      "any.required": "FIELD_REQUIRED",
    }),

  cuisines: Joi.array()
    .items(Joi.string().hex().length(24))
    .min(1)
    .required()
    .messages({
      "any.required": "FIELD_REQUIRED",
    }),

  dishTypes: Joi.array()
    .items(Joi.string().hex().length(24))
    .min(1)
    .required()
    .messages({
      "any.required": "FIELD_REQUIRED",
    }),

  dietTypes: Joi.array()
    .items(Joi.string().hex().length(24))
    .min(1)
    .required()
    .messages({
      "any.required": "FIELD_REQUIRED",
    }),

  description: Joi.string().trim().min(10).max(2000).required().messages({
    "string.base": "FIELD_MUST_BE_STRING",
    "string.empty": "FIELD_REQUIRED",
    "string.min": "FIELD_MIN_LENGTH",
    "string.max": "FIELD_MAX_LENGTH",
    "any.required": "FIELD_REQUIRED",
  }),

  email: Joi.string().email().lowercase().trim().required().messages({
    "string.email": "INVALID_EMAIL_FORMAT",
    "string.empty": "FIELD_REQUIRED",
    "any.required": "FIELD_REQUIRED",
  }),

  phone: Joi.string()
    .pattern(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/
    )
    .required()
    .messages({
      "string.pattern.base": "INVALID_PHONE_FORMAT",
      "string.empty": "FIELD_REQUIRED",
      "any.required": "FIELD_REQUIRED",
    }),

  latitude: Joi.number().min(-90).max(90).required().messages({
    "number.base": "FIELD_MUST_BE_NUMBER",
    "number.min": "LATITUDE_OUT_OF_RANGE",
    "number.max": "LATITUDE_OUT_OF_RANGE",
    "any.required": "FIELD_REQUIRED",
  }),

  longitude: Joi.number().min(-180).max(180).required().messages({
    "number.base": "FIELD_MUST_BE_NUMBER",
    "number.min": "LONGITUDE_OUT_OF_RANGE",
    "number.max": "LONGITUDE_OUT_OF_RANGE",
    "any.required": "FIELD_REQUIRED",
  }),
  street: Joi.string().trim().min(3).max(200).required().messages({
    "string.base": "FIELD_MUST_BE_STRING",
    "string.empty": "FIELD_REQUIRED",
    "string.min": "FIELD_MIN_LENGTH",
    "string.max": "FIELD_MAX_LENGTH",
    "any.required": "FIELD_REQUIRED",
  }),
  No: Joi.string().trim().required().messages({
    "string.base": "FIELD_MUST_BE_STRING",
    "string.empty": "FIELD_REQUIRED",
    "any.required": "FIELD_REQUIRED",
  }),
  postCode: Joi.string().trim().required().messages({
    "string.base": "FIELD_MUST_BE_STRING",
    "string.empty": "FIELD_REQUIRED",
    "any.required": "FIELD_REQUIRED",
  }),
  city: Joi.string().trim().min(2).required().messages({
    "string.base": "FIELD_MUST_BE_STRING",
    "string.empty": "FIELD_REQUIRED",
    "string.min": "FIELD_MIN_LENGTH",
    "any.required": "FIELD_REQUIRED",
  }),
  country: Joi.string().trim().min(2).required().messages({
    "string.base": "FIELD_MUST_BE_STRING",
    "string.empty": "FIELD_REQUIRED",
    "string.min": "FIELD_MIN_LENGTH",
    "any.required": "FIELD_REQUIRED",
  }),
  displayOnMap: Joi.string()
    .valid("none", "showFolded", "showUnfolded")
    .default("none")
    .messages({
      "any.only": "INVALID_DISPLAY_OPTION",
    }),

  displayDishesMenu: Joi.string()
    .valid("none", "showTopDishes", "showSpecificMenu")
    .default("none")
    .messages({
      "any.only": "INVALID_DISPLAY_OPTION",
    }),
});

// Update Restaurant Validation (partial updates)
export const updateRestaurantSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional().messages({
    "string.base": "FIELD_MUST_BE_STRING",
    "string.empty": "FIELD_REQUIRED",
    "string.min": "FIELD_MIN_LENGTH",
    "string.max": "FIELD_MAX_LENGTH",
  }),

  restaurantTypes: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base": "INVALID_OBJECT_ID",
    }),

  serviceTypes: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base": "INVALID_OBJECT_ID",
    }),

  businessTypes: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base": "INVALID_OBJECT_ID",
    }),

  cuisines: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base": "INVALID_OBJECT_ID",
    }),

  dishTypes: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base": "INVALID_OBJECT_ID",
    }),

  dietTypes: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base": "INVALID_OBJECT_ID",
    }),

  description: Joi.string().trim().min(10).max(2000).optional().messages({
    "string.base": "FIELD_MUST_BE_STRING",
    "string.empty": "FIELD_REQUIRED",
    "string.min": "FIELD_MIN_LENGTH",
    "string.max": "FIELD_MAX_LENGTH",
  }),

  email: Joi.string().email().lowercase().trim().optional().messages({
    "string.email": "INVALID_EMAIL_FORMAT",
    "string.empty": "FIELD_REQUIRED",
  }),

  phone: Joi.string()
    .pattern(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/
    )
    .optional()
    .messages({
      "string.pattern.base": "INVALID_PHONE_FORMAT",
      "string.empty": "FIELD_REQUIRED",
    }),

  latitude: Joi.number().min(-90).max(90).optional().messages({
    "number.base": "FIELD_MUST_BE_NUMBER",
    "number.min": "LATITUDE_OUT_OF_RANGE",
    "number.max": "LATITUDE_OUT_OF_RANGE",
  }),

  longitude: Joi.number().min(-180).max(180).optional().messages({
    "number.base": "FIELD_MUST_BE_NUMBER",
    "number.min": "LONGITUDE_OUT_OF_RANGE",
    "number.max": "LONGITUDE_OUT_OF_RANGE",
  }),

  // address: addressSchema.optional(),

  advancePayment: Joi.boolean().optional().messages({
    "boolean.base": "FIELD_MUST_BE_BOOLEAN",
  }),

  displayOnMap: Joi.string()
    .valid("none", "showFolded", "showUnfolded")
    .optional()
    .messages({
      "any.only": "INVALID_DISPLAY_OPTION",
    }),

  displayDishesMenu: Joi.string()
    .valid("none", "showTopDishes", "showSpecificMenu")
    .optional()
    .messages({
      "any.only": "INVALID_DISPLAY_OPTION",
    }),
});

// ==================== UPDATE TIMING VALIDATION ====================

const timeSlotSchema = Joi.object({
  from: Joi.number().min(0).max(1440).required().messages({
    "number.base": "FIELD_MUST_BE_NUMBER",
    "any.required": "FIELD_REQUIRED",
  }),
  to: Joi.number()
    .min(0)
    .max(1440)
    .greater(Joi.ref("from"))
    .required()
    .messages({
      "number.base": "FIELD_MUST_BE_NUMBER",
      "number.greater": "END_TIME_MUST_BE_GREATER",
      "any.required": "FIELD_REQUIRED",
    }),
});

const dateRangeSchema = Joi.object({
  startDate: Joi.date().required().messages({
    "date.base": "INVALID_DATE",
    "any.required": "FIELD_REQUIRED",
  }),
  endDate: Joi.date().min(Joi.ref("startDate")).optional().messages({
    "date.min": "END_DATE_MUST_BE_AFTER_START",
  }),
});

const hourEntrySchema = Joi.object({
  type: Joi.string()
    .valid("OPENING", "DELIVERY", "PICKUP")
    .required()
    .messages({
      "any.only": "INVALID_TYPE",
      "any.required": "FIELD_REQUIRED",
    }),

  scheduleType: Joi.string().valid("WEEKLY", "DATE_RANGE").required().messages({
    "any.only": "INVALID_SCHEDULE_TYPE",
    "any.required": "FIELD_REQUIRED",
  }),

  days: Joi.when("scheduleType", {
    is: "WEEKLY",
    then: Joi.array()
      .items(
        Joi.string().valid("MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN")
      )
      .min(1)
      .required()
      .messages({
        "array.min": "AT_LEAST_ONE_DAY_REQUIRED",
        "any.required": "FIELD_REQUIRED",
      }),
    otherwise: Joi.forbidden(),
  }),

  dateRange: Joi.when("scheduleType", {
    is: "DATE_RANGE",
    then: dateRangeSchema.required(),
    otherwise: Joi.forbidden(),
  }),

  isClosed: Joi.boolean().default(false),

  timeSlots: Joi.when("isClosed", {
    is: false,
    then: Joi.array().items(timeSlotSchema).min(1).required().messages({
      "array.min": "AT_LEAST_ONE_TIME_SLOT_REQUIRED",
      "any.required": "FIELD_REQUIRED",
    }),
    otherwise: Joi.forbidden(),
  }),

  info: Joi.string().allow("").optional(),
});

export const updateTimingSchema = Joi.object({
  // ── Opening Hours ──────────────────────────────────────────────
  openingHours: Joi.array().items(hourEntrySchema).min(1).required().messages({
    "array.min": "AT_LEAST_ONE_DAY_REQUIRED",
    "any.required": "FIELD_REQUIRED",
  }),

  additionalInfo: Joi.string().allow("").optional(),

  // ── Delivery ───────────────────────────────────────────────────
  isDeliveryService: Joi.boolean().required().messages({
    "boolean.base": "FIELD_MUST_BE_BOOLEAN",
    "any.required": "FIELD_REQUIRED",
  }),

  isDeliveryHoursSameAsOpeningHours: Joi.boolean().required().messages({
    "boolean.base": "FIELD_MUST_BE_BOOLEAN",
    "any.required": "FIELD_REQUIRED",
  }),

  // Required only when delivery is enabled AND hours are NOT same as opening
  deliveryHours: Joi.when("isDeliveryService", {
    is: true,
    then: Joi.when("isDeliveryHoursSameAsOpeningHours", {
      is: false,
      then: Joi.array().items(hourEntrySchema).min(1).required().messages({
        "array.min": "AT_LEAST_ONE_DELIVERY_HOUR_REQUIRED",
        "any.required": "FIELD_REQUIRED",
      }),
      otherwise: Joi.array().items(hourEntrySchema).optional(),
    }),
    otherwise: Joi.array().items(hourEntrySchema).optional(),
  }),

  additionalDeliveryInfo: Joi.string().allow("").optional(),

  // ── Food Pickup ────────────────────────────────────────────────
  isFoodPickUP: Joi.boolean().required().messages({
    "boolean.base": "FIELD_MUST_BE_BOOLEAN",
    "any.required": "FIELD_REQUIRED",
  }),

  isFoodPickupHoursSameAsOpeningHours: Joi.boolean().required().messages({
    "boolean.base": "FIELD_MUST_BE_BOOLEAN",
    "any.required": "FIELD_REQUIRED",
  }),

  // Required only when pickup is enabled AND hours are NOT same as opening
  foodPickupHours: Joi.when("isFoodPickUP", {
    is: true,
    then: Joi.when("isFoodPickupHoursSameAsOpeningHours", {
      is: false,
      then: Joi.array().items(hourEntrySchema).min(1).required().messages({
        "array.min": "AT_LEAST_ONE_PICKUP_HOUR_REQUIRED",
        "any.required": "FIELD_REQUIRED",
      }),
      otherwise: Joi.array().items(hourEntrySchema).optional(),
    }),
    otherwise: Joi.array().items(hourEntrySchema).optional(),
  }),

  additionalFoodPickupInfo: Joi.string().allow("").optional(),
});

export const step3ValidationSchema = Joi.object({
  restaurantId: Joi.string().optional().allow(""),
  payment: Joi.string()
    .valid("noAdvance", "requiredAdvance", "allowAdvance")
    .required()
    .messages({
      "string.required": "FIELD_REQUIRED",
      "string.empty": "FIELD_REQUIRED",
      "any.only": "INVALID_PAYMENT_OPTION",
    }),
  displayOnMap: Joi.string()
    .valid("none", "showFolded", "showUnfolded")
    .optional()
    .messages({
      "any.only": "INVALID_DISPLAY_MAP_OPTION",
    }),
  displayDishesMenu: Joi.string()
    .valid("none", "showTopDishes", "showSpecificMenu")
    .optional()
    .messages({
      "any.only": "INVALID_DISPLAY_DISHES_MENU_OPTION",
    }),
  specificMenuId: Joi.string()
    .hex()
    .length(24)
    .required()
    .when("displayDishesMenu", {
      is: "showSpecificMenu",
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    })
    .messages({
      "string.pattern.base": "INVALID_OBJECT_ID",
      "any.required": "FIELD_REQUIRED",
    }),
});
