import asyncHandler from "express-async-handler";
import Order from "../models/order.model.js";

// @desc   Get all orders
// @route  GET /api/orders
// @access Private
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.status(200).json(orders);
});

// @desc   Get an order
// @route  GET /api/orders/:id
// @access Private
export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  res.status(200).json(order);
});

// @desc   Add a new order
// @route  POST /api/orders
// @access Private (Admin)
export const addOrder = asyncHandler(async (req, res) => {
  const requiredFields = [
    "name",
    "products",
    "totalPrice",
    "status",
    "contact",
    "city",
    "country",
    "digitalAddress",
    "paymentMethod",
  ];
  const missingFields = requiredFields.filter(
    (field) => req.body[field] == null
  );

  if (missingFields.length > 0) {
    res.status(400);
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }

  const order = await Order.create(req.body);
  res.status(201).json(order);
});

// @desc   Update a Order
// @route  PUT /api/Orders/:id
// @access Private (Admin)
// export const updateOrder = asyncHandler(async (req, res) => {
//   const requiredFields = [
//     "name",
//     "products",
//     "totalPrice",
//     "status",
//     "contact",
//     "city",
//     "country",
//     "digitalAddress",
//     "paymentMethod",
//   ];
//   const missingFields = requiredFields.filter(
//     (field) => req.body[field] == null
//   );

//   if (missingFields.length > 0) {
//     res.status(400);
//     throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
//   }

//   const id = req.params.id;

//   const updatedItem = await Order.findByIdAndUpdate(id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   if (!updatedItem) {
//     res.status(404);
//     throw new Error("Order Not Found");
//   }

//   res.status(200).json(updatedItem);
// });

// @desc   Update a Order Status
// @route  PUT /api/Orders/:id
// @access Private (Admin)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    { status: req.body.status },
    { new: true }
  );

  res.status(200).json(updatedOrder);
});

// @desc   Delete a order
// @route  DELETE /api/orders/:id
// @access Private (Admin)
export const deleteOrder = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const deletedItem = await Order.findByIdAndDelete(id);

  if (!deletedItem) {
    res.status(404);
    throw new Error("Order Not Found");
  }

  res.status(200).json({ message: "Order deleted successfully", id });
});
