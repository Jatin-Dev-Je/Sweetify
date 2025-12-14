const Sweet = require("../models/Sweet");
const { NotFoundError, ForbiddenError, OutOfStockError, ValidationError } = require("../utils/errors");

const toSweetDTO = (sweet) => ({
  id: sweet._id.toString(),
  name: sweet.name,
  category: sweet.category,
  price: sweet.price,
  quantity: sweet.quantity,
  owner: sweet.owner,
});

const canManageSweet = (sweet, requester) => {
  if (!requester) {
    return false;
  }

  if (requester.role === "admin") {
    return true;
  }

  return sweet.owner === requester.email;
};

// Ensures all service operations fail fast when a record does not exist.
const findSweetOrThrow = async (id) => {
  const sweet = await Sweet.findById(id);
  if (!sweet) {
    throw new NotFoundError("Sweet not found");
  }
  return sweet;
};

const createSweet = async (data) => {
  const sweet = await Sweet.create(data);
  return toSweetDTO(sweet);
};

const getAllSweets = async () => {
  const sweets = await Sweet.find({}).sort({ name: 1 });
  return sweets.map(toSweetDTO);
};

const searchSweets = async (query = {}) => {
  const filter = {};

  if (query.name) filter.name = query.name;
  if (query.category) filter.category = query.category;

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  const sweets = await Sweet.find(filter).sort({ name: 1 });
  return sweets.map(toSweetDTO);
};

const updateSweet = async (id, updates, requester) => {
  const sweet = await findSweetOrThrow(id);

  if (!canManageSweet(sweet, requester)) {
    throw new ForbiddenError("You do not own this sweet");
  }

  Object.assign(sweet, updates);
  await sweet.save();
  return toSweetDTO(sweet);
};

const deleteSweet = async (id) => {
  const sweet = await findSweetOrThrow(id);
  await sweet.deleteOne();
  return true;
};

const purchaseSweet = async (id, amount = 1) => {
  const sweet = await findSweetOrThrow(id);
  const purchaseAmount = Number(amount) || 1;

  if (purchaseAmount <= 0) {
    throw new ValidationError("Quantity must be at least 1");
  }

  if (sweet.quantity < purchaseAmount) {
    throw new OutOfStockError(`Sweet is out of stock. Only ${sweet.quantity} units available`);
  }

  sweet.quantity -= purchaseAmount;
  await sweet.save();
  return toSweetDTO(sweet);
};

const restockSweet = async (id, amount = 1) => {
  const sweet = await findSweetOrThrow(id);
  const restockAmount = Number(amount) || 1;

  if (restockAmount <= 0) {
    throw new ValidationError("Quantity must be at least 1");
  }

  sweet.quantity += restockAmount;
  await sweet.save();
  return toSweetDTO(sweet);
};

module.exports = {
  createSweet,
  getAllSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
};
