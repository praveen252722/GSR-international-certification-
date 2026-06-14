import express from "express";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import { Admin } from "../models/Admin.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

function signToken(admin) {
  return jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
}

router.post(
  "/login",
  [
    body("email").optional({ checkFalsy: true }).isEmail().withMessage("A valid email is required"),
    body("username").optional({ checkFalsy: true }).trim().isLength({ min: 3 }).withMessage("Username is required"),
    body("password").isLength({ min: 7 }).withMessage("Password must be at least 7 characters")
  ],
  validate,
  async (req, res) => {
    const { email, username, password } = req.body;

    if (!email && !username) {
      return res.status(422).json({ message: "Email or username is required" });
    }

    const admin = await Admin.findOne(
      email ? { email: email.toLowerCase() } : { username: username.toLowerCase() }
    ).select("+password");

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      token: signToken(admin),
      admin: { id: admin._id, name: admin.name, username: admin.username, email: admin.email }
    });
  }
);

router.get("/me", protect, (req, res) => {
  res.json({ admin: req.admin });
});

router.post("/logout", protect, (_req, res) => {
  res.json({ message: "Logged out successfully" });
});

export default router;
