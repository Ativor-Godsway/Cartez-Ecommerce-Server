import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    //Learn how to create a user(firebase)
    name: {
      type: String,
      ref: "User",
      required: [true, "Order must belong to a user"],
    },
    products: [
      {
        product: {
          type: String, //Todo: mongoose.Schema.Types.ObjectId,
          ref: "Product", // link to Product model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity cannot be less than 1"],
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: [true, "Order must have a total price"],
    },
    status: {
      type: String,
      default: "pending",
    },
    contact: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    digitalAddress: { type: String, required: true },

    paymentMethod: {
      type: String,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
