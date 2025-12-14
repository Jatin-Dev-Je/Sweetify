const { registerUser, loginUser, getUserProfileById } = require("../services/auth.service");
const { successResponse, HttpError } = require("../utils/apiResponse");

/**
 * Registers a user after payload validation.
 */
const register = async (req, res, next) => {
  try {
    const authPayload = await registerUser(req.validatedBody ?? req.body);
    return successResponse(res, 201, authPayload);
  } catch (error) {
    return next(error);
  }
};

/**
 * Logs in a user and returns a signed token.
 */
const login = async (req, res, next) => {
  try {
    const authPayload = await loginUser(req.validatedBody ?? req.body);
    return successResponse(res, 200, authPayload);
  } catch (error) {
    return next(error);
  }
};

/**
 * Returns the authenticated user's profile.
 */
const me = async (req, res, next) => {
  try {
    const profile = await getUserProfileById(req.user.id);

    if (!profile) {
      return next(new HttpError(404, "User not found"));
    }

    return successResponse(res, 200, { user: profile });
  } catch (error) {
    return next(error);
  }
};

module.exports = { register, login, me };
