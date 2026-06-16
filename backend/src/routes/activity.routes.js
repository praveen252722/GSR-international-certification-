import express from "express";
import { ActivityLog } from "../models/ActivityLog.js";
import { protect } from "../middleware/auth.js";
import { adminOnly } from "../middleware/rbac.js";

const router = express.Router();

router.get("/", protect, adminOnly, async (req, res) => {
  const { search, action, module: mod, startDate, endDate, page = 1, limit = 50, sort = "desc" } = req.query;
  const filter = {};

  if (search) {
    filter.$or = [
      { adminName: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { targetName: { $regex: search, $options: "i" } },
      { action: { $regex: search, $options: "i" } }
    ];
  }

  if (action) filter.action = { $regex: action, $options: "i" };
  if (mod) filter.module = { $regex: mod, $options: "i" };
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(200, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [logs, total] = await Promise.all([
    ActivityLog.find(filter)
      .sort({ createdAt: sort === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limitNum),
    ActivityLog.countDocuments(filter)
  ]);

  res.json({
    logs,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum)
    }
  });
});

router.get("/export/csv", protect, adminOnly, async (req, res) => {
  const { startDate, endDate } = req.query;
  const filter = {};
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const logs = await ActivityLog.find(filter).sort({ createdAt: -1 });

  const rows = [
    ["Admin Name", "Admin Email", "Role", "Action", "Module", "Description", "Target", "IP Address", "Browser", "Device", "Date", "Time", "Success"],
    ...logs.map((log) => {
      const d = new Date(log.createdAt);
      return [
        log.adminName,
        log.adminEmail,
        log.adminRole,
        log.action,
        log.module,
        log.description,
        log.targetName,
        log.ipAddress,
        log.browser,
        log.device,
        d.toLocaleDateString("en-IN"),
        d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        log.success ? "Yes" : "No"
      ];
    })
  ];

  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell || "").replaceAll('"', '""')}"`).join(","))
    .join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=activity-logs.csv");
  res.send(csv);
});

router.get("/stats", protect, adminOnly, async (req, res) => {
  const [totalLogs, loginCount, failedLogins, uniqueUsers, recentLogins] = await Promise.all([
    ActivityLog.countDocuments(),
    ActivityLog.countDocuments({ action: "Login", success: true }),
    ActivityLog.countDocuments({ action: "Failed Login" }),
    ActivityLog.distinct("adminId", { action: "Login", success: true }),
    ActivityLog.find({ action: "Login", success: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("adminName createdAt ipAddress browser device")
  ]);

  res.json({
    totalLogs,
    loginCount,
    failedLogins,
    uniqueUsers: uniqueUsers.length,
    recentLogins
  });
});

export default router;
