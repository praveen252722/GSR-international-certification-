import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";

export async function protect(req, res, next) {
  next();
}
