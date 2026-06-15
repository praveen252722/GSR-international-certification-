import cloudinary from "../config/cloudinary.js";
import { Organization } from "../models/Organization.js";

function removeFromCloudinary(publicId) {
  if (!publicId) return;
  cloudinary.uploader.destroy(publicId, (err) => {
    if (err) console.error("Cloudinary delete error:", err.message);
  });
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
  const image1 = req.files?.image1?.[0] || req.files?.image?.[0] || req.file;
  const image2 = req.files?.image2?.[0];

  if (!image1) {
    return res.status(422).json({ message: "Project Image 1 is required for new organization records" });
  }

  const organization = await Organization.create({
    title: req.body.title,
    description: req.body.description,
    certificationDate: req.body.certificationDate,
    status: req.body.status || "Certified",
    imageUrl: image1.path,
    publicId: image1.filename,
    imageUrl2: image2?.path || "",
    publicId2: image2?.filename || ""
  });

  res.status(201).json(organization);
}

export async function updateOrganization(req, res) {
  const existing = await Organization.findById(req.params.id);
  if (!existing) return res.status(404).json({ message: "Organization not found" });

  const payload = {
    title: req.body.title,
    description: req.body.description,
    certificationDate: req.body.certificationDate,
    status: req.body.status || existing.status,
    imageUrl: existing.imageUrl,
    publicId: existing.publicId,
    imageUrl2: existing.imageUrl2,
    publicId2: existing.publicId2
  };

  const image1 = req.files?.image1?.[0] || req.files?.image?.[0] || req.file;
  const image2 = req.files?.image2?.[0];

  if (image1) {
    removeFromCloudinary(existing.publicId);
    payload.imageUrl = image1.path;
    payload.publicId = image1.filename;
  }

  if (image2) {
    removeFromCloudinary(existing.publicId2);
    payload.imageUrl2 = image2.path;
    payload.publicId2 = image2.filename;
  }

  const organization = await Organization.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true
  });

  res.json(organization);
}

export async function deleteOrganization(req, res) {
  const organization = await Organization.findByIdAndDelete(req.params.id);
  if (!organization) return res.status(404).json({ message: "Organization not found" });

  removeFromCloudinary(organization.publicId);
  removeFromCloudinary(organization.publicId2);
  res.json({ message: "Organization deleted" });
}
