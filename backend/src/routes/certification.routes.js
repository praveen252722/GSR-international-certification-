import express from "express";
import { body } from "express-validator";
import { Certification } from "../models/Certification.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

const certificationValidation = [
  body("name").trim().isLength({ min: 2 }).withMessage("Certification name is required"),
  body("description").trim().isLength({ min: 10 }).withMessage("Description is required"),
  body("category").trim().isLength({ min: 2 }).withMessage("Category is required"),
  body("status").optional().isIn(["Active", "Inactive"]).withMessage("Invalid status")
];

router.get("/", async (req, res) => {
  const filter = req.query.public === "true" ? { status: "Active" } : {};
  const certifications = await Certification.find(filter).sort({ createdAt: -1 });
  res.json(certifications);
});

router.post("/", protect, certificationValidation, validate, async (req, res) => {
  const certification = await Certification.create(req.body);
  res.status(201).json(certification);
});

router.put("/:id", protect, certificationValidation, validate, async (req, res) => {
  const certification = await Certification.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!certification) return res.status(404).json({ message: "Certification not found" });
  res.json(certification);
});

router.delete("/:id", protect, async (req, res) => {
  const certification = await Certification.findByIdAndDelete(req.params.id);
  if (!certification) return res.status(404).json({ message: "Certification not found" });
  res.json({ message: "Certification deleted" });
});

router.get("/export/csv", protect, async (_req, res) => {
  const certifications = await Certification.find().sort({ createdAt: -1 });
  const rows = [
    ["Certification Name", "Description", "Category", "Status", "Verification Support", "Created At"],
    ...certifications.map((item) => [
      item.name,
      item.description,
      item.category,
      item.status,
      item.verificationSupport ? "Yes" : "No",
      item.createdAt.toISOString()
    ])
  ];

  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=certifications.csv");
  res.send(csv);
});

export default router;
