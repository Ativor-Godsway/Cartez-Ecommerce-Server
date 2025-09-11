import express from "express";
import { protect } from "../middleware/auth.js";
import {
  addOrder,
  deleteOrder,
  getOrder,
  getOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";

const OrderRouter = express.Router();

OrderRouter.route("/").get(protect, getOrders).post(addOrder);
OrderRouter.route("/:id")
  .get(getOrder)
  .put(protect, updateOrderStatus)
  .delete(protect, deleteOrder);

export default OrderRouter;
