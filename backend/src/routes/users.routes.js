import express from "express";
import { body } from "express-validator";
import { Admin } from "../models/Admin.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

const userValidation = [
  body("username").trim().isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),
  body("password").isLength({ min: 7 }).withMessage("Password must be at least 7 characters"),
  body("name").trim().isLength({ min: 2 }).withMessage("Name is required")
];

router.get("/", protect, async (_req, res) => {
  const users = await Admin.find().select("-password");
  res.json(users);
});

router.post("/", protect, userValidation, validate, async (req, res) => {
  const { username, password, name, email } = req.body;
  const exists = await Admin.findOne({ username: username.toLowerCase() });
  if (exists) return res.status(409).json({ message: "Username already exists" });
  const user = await Admin.create({ username, password, name, email: email || `${username}@gsr.local` });
  const { password: _, ...safe } = user.toObject();
  res.status(201).json(safe);
});

router.put("/:id", protect, async (req, res) => {
  const update = {};
  if (req.body.username) update.username = req.body.username;
  if (req.body.name) update.name = req.body.name;
  if (req.body.email) update.email = req.body.email;
  if (req.body.password) update.password = req.body.password;
  const user = await Admin.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

router.delete("/:id", protect, async (req, res) => {
  const user = await Admin.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted" });
});

export default router;
