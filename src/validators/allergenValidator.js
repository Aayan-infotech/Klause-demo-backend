import Joi from "joi";

export const allergenValidationSchema = Joi.object({
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
});
