import Joi from "joi";

export const additiveValidationSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.base": "NAME_MUST_BE_STRING",
    "string.empty": "NAME_CANNOT_BE_EMPTY",
    "string.min": "NAME_MIN_LENGTH_2",
    "string.max": "NAME_MAX_LENGTH_100",
    "any.required": "ADDITIVE_NAME_IS_REQUIRED",
  }),
  description: Joi.string().trim().max(500).optional().allow("").messages({
    "string.base": "DESCRIPTION_MUST_BE_STRING",
    "string.max": "DESCRIPTION_MAX_LENGTH_500",
  }),
});