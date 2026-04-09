const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { ApiError } = require("../utils/ApiError");
const { signJwt } = require("../utils/jwt");

async function signup({ email, password }) {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ApiError(409, "Email already exists");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email: email.toLowerCase(), passwordHash });
  const token = signJwt({ sub: user._id.toString(), email: user.email });

  return { token, user: { id: user._id, email: user.email } };
}

async function login({ email, password }) {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new ApiError(401, "Invalid email or password");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new ApiError(401, "Invalid email or password");

  const token = signJwt({ sub: user._id.toString(), email: user.email });
  return { token, user: { id: user._id, email: user.email } };
}

module.exports = { signup, login };
