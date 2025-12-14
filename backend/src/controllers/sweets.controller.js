const {
  createSweet,
  getAllSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
} = require("../services/sweets.service");
const { successResponse } = require("../utils/apiResponse");

// Each controller stays lean by delegating business logic to the service layer
// and returning the standardized API envelope.
const addSweet = async (req, res, next) => {
  try {
    const sweet = await createSweet({ ...req.validatedBody, owner: req.user.email });
    return successResponse(res, 201, { sweet });
  } catch (error) {
    return next(error);
  }
};

const listSweets = async (req, res, next) => {
  try {
    const sweets = await getAllSweets();
    return successResponse(res, 200, { sweets });
  } catch (error) {
    return next(error);
  }
};

const searchSweetsController = async (req, res, next) => {
  try {
    const sweets = await searchSweets(req.validatedQuery);
    return successResponse(res, 200, { sweets });
  } catch (error) {
    return next(error);
  }
};

const updateSweetController = async (req, res, next) => {
  try {
    const sweet = await updateSweet(req.params.id, req.validatedBody, req.user);
    return successResponse(res, 200, { sweet });
  } catch (error) {
    return next(error);
  }
};

const deleteSweetController = async (req, res, next) => {
  try {
    await deleteSweet(req.params.id);
    return successResponse(res, 200, { deleted: true });
  } catch (error) {
    return next(error);
  }
};

const purchaseSweetController = async (req, res, next) => {
  try {
    const sweet = await purchaseSweet(req.params.id, req.validatedBody?.quantity ?? 1);
    return successResponse(res, 200, { sweet });
  } catch (error) {
    return next(error);
  }
};

const restockSweetController = async (req, res, next) => {
  try {
    const sweet = await restockSweet(req.params.id, req.validatedBody?.quantity ?? 1);
    return successResponse(res, 200, { sweet });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  addSweet,
  listSweets,
  searchSweets: searchSweetsController,
  updateSweet: updateSweetController,
  deleteSweet: deleteSweetController,
  purchaseSweet: purchaseSweetController,
  restockSweet: restockSweetController,
};
