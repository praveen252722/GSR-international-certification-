import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";

export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(payload.id).select("_id name email username");

    if (!admin) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    req.admin = admin;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired authentication token" });
  }
}
