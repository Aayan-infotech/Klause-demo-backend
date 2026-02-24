import Joi from "joi";

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

const validityPeriodEntrySchema = Joi.object({

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

export const menuValidationSchema = Joi.object({
  restaurantId: Joi.string().hex().length(24).required().messages({
    "string.base": "FIELD_MUST_BE_STRING",
    "string.hex": "INVALID_OBJECT_ID",
    "string.length": "INVALID_OBJECT_ID",
    "any.required": "FIELD_REQUIRED",
  }),

  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.base": "FIELD_MUST_BE_STRING",
    "string.empty": "FIELD_REQUIRED",
    "string.min": "FIELD_MIN_LENGTH",
    "string.max": "FIELD_MAX_LENGTH",
    "any.required": "FIELD_REQUIRED",
  }),

  description: Joi.string().trim().allow("").optional().messages({
    "string.base": "FIELD_MUST_BE_STRING",
  }),

  published: Joi.string().valid("DRAFT", "PUBLISH").default("DRAFT").messages({
    "any.only": "PUBLISHED_MUST_BE_DRAFT_OR_PUBLISH",
  }),

  showDishesOnTop: Joi.boolean().default(false).messages({
    "boolean.base": "FIELD_MUST_BE_BOOLEAN",
  }),

  validityPeriod: Joi.array()
    .items(validityPeriodEntrySchema)
    .min(1)
    .required()
    .messages({
      "array.base": "FIELD_MUST_BE_ARRAY",
      "array.min": "AT_LEAST_ONE_VALIDITY_PERIOD_REQUIRED",
      "any.required": "FIELD_REQUIRED",
    }),

  additionalText: Joi.string().trim().allow("").optional().messages({
    "string.base": "FIELD_MUST_BE_STRING",
  }),

  outputDesigned: Joi.string().trim().allow("").optional().messages({
    "string.base": "FIELD_MUST_BE_STRING",
  }),

  autoNumbering: Joi.object({
    enabled: Joi.boolean().default(false).messages({
      "boolean.base": "FIELD_MUST_BE_BOOLEAN",
    }),
    showOnDishesList: Joi.boolean().default(false).messages({
      "boolean.base": "FIELD_MUST_BE_BOOLEAN",
    }),
  })
    .default({ enabled: false, showOnDishesList: false })
    .optional()
    .messages({
      "object.base": "FIELD_MUST_BE_OBJECT",
    }),
});

export const updateMenuValidationSchema = Joi.object({
  restaurantId: Joi.string().hex().length(24).required().messages({
    "string.base": "FIELD_MUST_BE_STRING",
    "string.hex": "INVALID_OBJECT_ID",
    "string.length": "INVALID_OBJECT_ID",
    "any.required": "FIELD_REQUIRED",
  }),
  name: Joi.string().trim().min(2).max(100).optional().messages({
    "string.base": "FIELD_MUST_BE_STRING",
    "string.empty": "FIELD_REQUIRED",
    "string.min": "FIELD_MIN_LENGTH",
    "string.max": "FIELD_MAX_LENGTH",
  }),
  description: Joi.string().trim().allow("").optional().messages({
    "string.base": "FIELD_MUST_BE_STRING",
  }),
  published: Joi.string().valid("DRAFT", "PUBLISH").optional().messages({
    "any.only": "PUBLISHED_MUST_BE_DRAFT_OR_PUBLISH",
  }),
  showDishesOnTop: Joi.boolean().optional().messages({
    "boolean.base": "FIELD_MUST_BE_BOOLEAN",
  }),
  validityPeriod: Joi.array()
    .items(validityPeriodEntrySchema)
    .min(1)
    .optional()
    .messages({
      "array.base": "FIELD_MUST_BE_ARRAY",
      "array.min": "AT_LEAST_ONE_VALIDITY_PERIOD_REQUIRED",
    }),
  additionalText: Joi.string().trim().allow("").optional().messages({
    "string.base": "FIELD_MUST_BE_STRING",
  }),
  outputDesigned: Joi.string().trim().allow("").optional().messages({
    "string.base": "FIELD_MUST_BE_STRING",
  }),
  autoNumbering: Joi.object({
    enabled: Joi.boolean().default(false).messages({
      "boolean.base": "FIELD_MUST_BE_BOOLEAN",
    }),
    showOnDishesList: Joi.boolean().default(false).messages({
      "boolean.base": "FIELD_MUST_BE_BOOLEAN",
    }),
  })
    .optional()
    .messages({
      "object.base": "FIELD_MUST_BE_OBJECT",
    }),
});
