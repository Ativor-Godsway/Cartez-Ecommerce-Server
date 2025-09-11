import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
    },
    image: {
      url: {
        type: String,
        required: [true, "Product image URL is required"],
      },
      public_id: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true } // ✅ adds createdAt & updatedAt
);

const Product = mongoose.model("Product", productSchema);

export default Product;
