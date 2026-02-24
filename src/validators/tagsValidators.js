import Joi from "joi";

export const createTagValidator = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.base": "NAME_MUST_BE_STRING",
    "string.empty": "NAME_REQUIRED",
    "string.min": "NAME_MIN_LENGTH_2",
    "string.max": "NAME_MAX_LENGTH_100",
    "any.required": "NAME_REQUIRED",
  }),
});

// ─── Update Global Tag ────────────────────────────────────────────────────────
export const updateTagValidator = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional().messages({
    "string.base": "FIELD_MUST_BE_STRING",
    "string.empty": "FIELD_CANNOT_BE_EMPTY",
    "string.min": "FIELD_MIN_LENGTH",
    "string.max": "FIELD_MAX_LENGTH",
  }),
   isActive: Joi.boolean().optional().messages({
    "boolean.base": "FIELD_MUST_BE_BOOLEAN",
  }),
})
  .min(1)
  .messages({
    "object.min": "AT_LEAST_ONE_FIELD_REQUIRED",
  });
