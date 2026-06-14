import express from "express";
import { body } from "express-validator";
import { Inquiry } from "../models/Inquiry.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

const inquiryValidation = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name is required"),
  body("email").isEmail().withMessage("A valid email is required"),
  body("phone").optional({ checkFalsy: true }).trim().isLength({ min: 7 }).withMessage("Invalid phone"),
  body("message").trim().isLength({ min: 10 }).withMessage("Message is required"),
  body("source").optional().isIn(["Contact", "Apply"]).withMessage("Invalid inquiry source")
];

router.post("/", inquiryValidation, validate, async (req, res) => {
  const inquiry = await Inquiry.create(req.body);
  res.status(201).json({ message: "Inquiry submitted successfully", inquiry });
});

router.get("/", protect, async (_req, res) => {
  const inquiries = await Inquiry.find().sort({ createdAt: -1 });
  res.json(inquiries);
});

router.patch(
  "/:id/status",
  protect,
  [body("status").isIn(["New", "In Progress", "Closed"]).withMessage("Invalid status")],
  validate,
  async (req, res) => {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
    res.json(inquiry);
  }
);

router.delete("/:id", protect, async (req, res) => {
  const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
  if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
  res.json({ message: "Inquiry deleted" });
});

export default router;
