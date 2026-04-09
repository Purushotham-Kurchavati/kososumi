const { z } = require("zod");
const { asyncHandler } = require("../utils/asyncHandler");
const { login, signup } = require("../services/authService");

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const signupController = asyncHandler(async (req, res) => {
  const data = authSchema.parse(req.body);
  const result = await signup(data);
  res.status(201).json(result);
});

const loginController = asyncHandler(async (req, res) => {
  const data = authSchema.parse(req.body);
  const result = await login(data);
  res.json(result);
});

module.exports = { signupController, loginController };
