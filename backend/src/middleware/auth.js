const User = require("../models/User");
const { ApiError } = require("../utils/ApiError");
const { verifyJwt } = require("../utils/jwt");

async function authMiddleware(req, _res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return next(new ApiError(401, "Missing auth token"));
  }

  try {
    const decoded = verifyJwt(token);
    const user = await User.findById(decoded.sub).select("_id email");
    if (!user) return next(new ApiError(401, "Invalid auth token"));
    req.user = user;
    next();
  } catch (_err) {
    next(new ApiError(401, "Invalid auth token"));
  }
}

module.exports = { authMiddleware };
