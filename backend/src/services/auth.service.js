const bcrypt = require("bcrypt");
const User = require("../models/User");
const { generateToken } = require("../utils/jwt");
const { config } = require("../config/env");
const { ConflictError, AuthenticationError } = require("../utils/errors");

const toUserDTO = (user) => ({
  id: user._id.toString(),
  email: user.email,
  role: user.role,
});

const buildAuthPayload = (user) => ({
  token: generateToken({ id: user._id.toString(), role: user.role, email: user.email }),
  user: toUserDTO(user),
});

/**
 * Registers a user with hashed credentials and returns an auth payload.
 */
const registerUser = async ({ email, password, role = "user" }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ConflictError("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, config.bcryptSaltRounds);
  const user = await User.create({ email, password: hashedPassword, role });

  return buildAuthPayload(user);
};

/**
 * Authenticates user credentials and returns a signed JWT + DTO.
 */
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AuthenticationError("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AuthenticationError("Invalid credentials");
  }

  return buildAuthPayload(user);
};

/**
 * Loads a user's public profile by identifier.
 */
const getUserProfileById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return null;

  return toUserDTO(user);
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfileById,
};
