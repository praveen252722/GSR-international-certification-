import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "path";
import authRoutes from "./routes/auth.routes.js";
import certificationRoutes from "./routes/certification.routes.js";
import organizationRoutes from "./routes/organization.routes.js";
import inquiryRoutes from "./routes/inquiry.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

export function createApp() {
  const app = express();
  const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim());

  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error("Not allowed by CORS"));
      },
      credentials: true
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: true,
      legacyHeaders: false
    })
  );
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/certifications", certificationRoutes);
  app.use("/api/organizations", organizationRoutes);
  app.use("/api/v1/organizations", organizationRoutes);
  app.use("/api/inquiries", inquiryRoutes);
  app.use("/api/settings", settingsRoutes);
  app.use("/api/dashboard", dashboardRoutes);

  app.use((err, _req, res, _next) => {
    const status = err.status || 500;
    res.status(status).json({
      message: status === 500 ? "Server error" : err.message
    });
  });

  return app;
}
