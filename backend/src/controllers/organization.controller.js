import fs from "fs";
import path from "path";
import { Organization } from "../models/Organization.js";

function imagePathFromRequest(req) {
  return req.file ? `/uploads/${req.file.filename}` : "";
}

function removeUploadedImage(imageUrl) {
  if (!imageUrl || !imageUrl.startsWith("/uploads/")) return;
  const filePath = path.join(process.cwd(), imageUrl.replace(/^\//, ""));
  fs.unlink(filePath, () => {});
}

function organizationPayload(req, existingImageUrl = "") {
  return {
    title: req.body.title,
    description: req.body.description,
    certificationDate: req.body.certificationDate,
    status: req.body.status || "Certified",
    imageUrl: imagePathFromRequest(req) || existingImageUrl
  };
}

export async function listOrganizations(req, res) {
  const filter = req.query.public === "true" ? { status: { $in: ["Certified", "Active"] } } : {};
  const organizations = await Organization.find(filter).sort({ certificationDate: -1, createdAt: -1 });
  res.json(organizations);
}

export async function getOrganization(req, res) {
  const organization = await Organization.findById(req.params.id);
  if (!organization) return res.status(404).json({ message: "Organization not found" });
  res.json(organization);
}

export async function createOrganization(req, res) {
  if (!req.file) {
    return res.status(422).json({ message: "Image is required for new organization records" });
  }

  const organization = await Organization.create(organizationPayload(req));
  res.status(201).json(organization);
}

export async function updateOrganization(req, res) {
  const existing = await Organization.findById(req.params.id);
  if (!existing) return res.status(404).json({ message: "Organization not found" });

  const payload = organizationPayload(req, existing.imageUrl);
  const organization = await Organization.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true
  });

  if (req.file && existing.imageUrl !== organization.imageUrl) {
    removeUploadedImage(existing.imageUrl);
  }

  res.json(organization);
}

export async function deleteOrganization(req, res) {
  const organization = await Organization.findByIdAndDelete(req.params.id);
  if (!organization) return res.status(404).json({ message: "Organization not found" });
  removeUploadedImage(organization.imageUrl);
  res.json({ message: "Organization deleted" });
}
