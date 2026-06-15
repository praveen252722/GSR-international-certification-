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
  body("status").optional().isIn(["Active", "Inactive"]).withMessage("Invalid status"),
  body("certificateId").optional({ checkFalsy: true }).trim().isLength({ min: 3 }).withMessage("Certificate ID is too short"),
  body("companyName").optional({ checkFalsy: true }).trim().isLength({ min: 2 }).withMessage("Company name is too short"),
  body("scope").optional({ checkFalsy: true }).trim().isLength({ min: 2 }).withMessage("Scope is too short"),
  body("publishDate").optional({ checkFalsy: true }).isISO8601().withMessage("Invalid publish date"),
  body("expiryDate").optional({ checkFalsy: true }).isISO8601().withMessage("Invalid expiry date"),
  body("certificateState").optional().isIn(["Active", "Expired", "Suspended"]).withMessage("Invalid certificate state")
];

function cleanCertificationPayload(payload) {
  const cleaned = { ...payload };
  ["certificateId", "companyName", "scope", "publishDate", "expiryDate"].forEach((field) => {
    if (cleaned[field] === "") cleaned[field] = undefined;
  });
  if (cleaned.certificateId) cleaned.certificateId = String(cleaned.certificateId).trim().toUpperCase();
  return cleaned;
}

router.get("/", async (req, res) => {
  const filter = req.query.public === "true" ? { status: "Active" } : {};
  const certifications = await Certification.find(filter).sort({ createdAt: -1 });
  res.json(certifications);
});

router.get("/verify/:certificateId", async (req, res) => {
  const certification = await Certification.findOne({
    certificateId: String(req.params.certificateId).trim().toUpperCase()
  });

  if (!certification) return res.status(404).json({ message: "Certificate not found" });
  res.json(certification);
});

router.post("/", protect, certificationValidation, validate, async (req, res) => {
  const certification = await Certification.create(cleanCertificationPayload(req.body));
  res.status(201).json(certification);
});

router.put("/:id", protect, certificationValidation, validate, async (req, res) => {
  const certification = await Certification.findByIdAndUpdate(req.params.id, cleanCertificationPayload(req.body), {
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
    [
      "Certification Name",
      "Description",
      "Category",
      "Status",
      "Verification Support",
      "Certificate ID",
      "Company Name",
      "Scope",
      "Publish Date",
      "Expiry Date",
      "Certificate State",
      "Created At"
    ],
    ...certifications.map((item) => [
      item.name,
      item.description,
      item.category,
      item.status,
      item.verificationSupport ? "Yes" : "No",
      item.certificateId,
      item.companyName,
      item.scope,
      item.publishDate ? item.publishDate.toISOString() : "",
      item.expiryDate ? item.expiryDate.toISOString() : "",
      item.certificateState,
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
