const Joi = require("joi");

const createSweetSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  category: Joi.string().trim().min(2).max(80).required(),
  price: Joi.number().positive().precision(2).required(),
  quantity: Joi.number().integer().min(0).required(),
});

const updateSweetSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120),
  category: Joi.string().trim().min(2).max(80),
  price: Joi.number().positive().precision(2),
  quantity: Joi.number().integer().min(0),
})
  .min(1)
  .required();

const searchSweetsSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120),
  category: Joi.string().trim().min(2).max(80),
  minPrice: Joi.number().precision(2).min(0),
  maxPrice: Joi.number().precision(2).min(0),
}).custom((value, helpers) => {
  if (value.minPrice !== undefined && value.maxPrice !== undefined && value.maxPrice < value.minPrice) {
    return helpers.message("\"maxPrice\" must be greater than or equal to \"minPrice\"");
  }
  return value;
});

const quantityPayloadSchema = Joi.object({
  quantity: Joi.number().integer().min(1).max(1000).default(1),
});

module.exports = { createSweetSchema, updateSweetSchema, searchSweetsSchema, quantityPayloadSchema };
