import express from "express";
import { Certification } from "../models/Certification.js";
import { Organization } from "../models/Organization.js";
import { Inquiry } from "../models/Inquiry.js";
import { Admin } from "../models/Admin.js";
import { protect } from "../middleware/auth.js";
import { activityFromDocuments } from "../utils/activity.js";

const router = express.Router();

router.get("/", protect, async (_req, res) => {
  const [
    totalCertifications,
    totalOrganizations,
    totalInquiries,
    totalUsers,
    activeCerts,
    expiredCerts,
    suspendedCerts,
    activeOrganizations,
    certifications,
    organizations,
    inquiries
  ] = await Promise.all([
    Certification.countDocuments(),
    Organization.countDocuments(),
    Inquiry.countDocuments(),
    Admin.countDocuments(),
    Certification.countDocuments({ status: "Active" }),
    Certification.countDocuments({ certificateState: "Expired" }),
    Certification.countDocuments({ certificateState: "Suspended" }),
    Organization.countDocuments({ status: "Certified" }),
    Certification.find().sort({ createdAt: -1 }).limit(5),
    Organization.find().sort({ createdAt: -1 }).limit(5),
    Inquiry.find().sort({ createdAt: -1 }).limit(5)
  ]);

  res.json({
    totalCertifications,
    totalOrganizations,
    totalInquiries,
    totalUsers,
    activeCertifications: activeCerts,
    expiredCertifications: expiredCerts,
    suspendedCertifications: suspendedCerts,
    activeOrganizations,
    recentActivity: activityFromDocuments({ certifications, organizations, inquiries })
  });
});

export default router;
