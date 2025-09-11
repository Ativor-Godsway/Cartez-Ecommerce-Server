import asyncHandler from "express-async-handler";
import Admin from "../models/admin.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signToken = (admin) =>
  jwt.sign(
    { id: admin._id, email: admin.email }, // payload
    process.env.JWT_SECRET, // secret
    { expiresIn: "7d" } // expiry
  );

export const createAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields required");
  }
  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    return res
      .status(400)
      .json({ success: false, message: "Admin already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newAdmin = await Admin.create({ email, password: hashedPassword });
  res.status(201).json({
    success: true,
    message: "Successfully Created User",
    Admin: newAdmin,
  });
});

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields required");
  }

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(404).json({ success: false, message: "Admin Not Found" });
  }

  const ok = await bcrypt.compare(password, admin.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken(admin);

  res.status(201).json({
    success: true,
    message: "Successfully Logged In User",
    token: token,
  });
});
