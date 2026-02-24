import Joi from "joi";

const variantEntrySchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required().messages({
    "string.base": "FIELD_MUST_BE_STRING",
    "string.empty": "FIELD_REQUIRED",
    "string.min": "FIELD_MIN_LENGTH",
    "string.max": "FIELD_MAX_LENGTH",
    "any.required": "FIELD_REQUIRED",
  }),
});

export const createVariantSetValidationSchema = Joi.object({
  restaurantId: Joi.string().hex().length(24).required().messages({
    "string.empty": "FIELD_REQUIRED",
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
  displayMode: Joi.string()
    .valid("horizontal", "vertical", "auto")
    .default("auto")
    .messages({
      "any.only": "DISPLAY_MODE_INVALID",
    }),
  variants: Joi.array().items(variantEntrySchema).min(1).required().messages({
    "array.base": "FIELD_MUST_BE_ARRAY",
    "array.min": "AT_LEAST_ONE_VARIANT_REQUIRED",
    "any.required": "FIELD_REQUIRED",
  }),
});

export const updateVariantSetValidationSchema = Joi.object({
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
  displayMode: Joi.string()
    .valid("horizontal", "vertical", "auto")
    .optional()
    .messages({
      "any.only": "DISPLAY_MODE_INVALID",
    }),
  variants: Joi.array()
    .items(
      variantEntrySchema.keys({
        _id: Joi.string().hex().length(24).optional().messages({
          "string.hex": "INVALID_OBJECT_ID",
          "string.length": "INVALID_OBJECT_ID",
        }),
        removeIcon: Joi.boolean().optional(), // flag to clear icon
      })
    )
    .min(1)
    .optional()
    .messages({
      "array.base": "FIELD_MUST_BE_ARRAY",
      "array.min": "AT_LEAST_ONE_VARIANT_REQUIRED",
    }),
});
