import express from "express";
import { createAdmin, loginAdmin } from "../controllers/admin.controller.js";
const AdminRouter = express.Router();

AdminRouter.route("/create-admin").post(createAdmin);
AdminRouter.route("/login").post(loginAdmin);

export default AdminRouter;
