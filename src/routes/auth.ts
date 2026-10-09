import { Router } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import type { TokenPayload } from "../middleware/auth.js";

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

export const authRouter = Router();

authRouter.post<ParamsDictionary, unknown, RegisterBody>("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409).json({ message: "That email is already registered" });
    return;
  }

  const user = await User.create({ name, email, password });
  res.status(201).json(user.toJSON());
});

authRouter.post<ParamsDictionary, unknown, LoginBody>("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ message: "Email or password is incorrect" });
    return;
  }

  const payload: TokenPayload = { userId: String(user._id) };
  const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "2h" });
  res.status(200).json({ token, user: user.toJSON() });
});