import express from "express";
import { body } from "express-validator";
import { Setting } from "../models/Setting.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

async function getSettingsDocument() {
  const existing = await Setting.findOne();
  if (existing) return existing;
  return Setting.create({});
}

router.get("/", async (_req, res) => {
  const settings = await getSettingsDocument();
  res.json(settings);
});

router.put(
  "/",
  protect,
  [
    body("companyName").trim().isLength({ min: 2 }).withMessage("Company name is required"),
    body("contactEmail").isEmail().withMessage("A valid contact email is required"),
    body("contactNumber").trim().isLength({ min: 5 }).withMessage("Contact number is required"),
    body("address").trim().isLength({ min: 5 }).withMessage("Address is required")
  ],
  validate,
  async (req, res) => {
    const settings = await getSettingsDocument();
    settings.set(req.body);
    await settings.save();
    res.json(settings);
  }
);

export default router;
