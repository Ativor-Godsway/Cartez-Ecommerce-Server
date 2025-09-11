import { v2 as cloudinary } from "cloudinary";
import asyncHandler from "express-async-handler";
import Product from "../models/product.model.js";

// @desc   Get all products
// @route  GET /api/products
// @access Public
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.status(200).json(products);
});

// @desc   Get all product
// @route  GET /api/products/:id
// @access Public
export const getProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id);
  res.status(200).json(product);
});

// @desc   Add a new product
// @route  POST /api/products
// @access Private (Admin)
export const addProduct = asyncHandler(async (req, res) => {
  const requiredFields = ["name", "description", "price", "category"];
  const missingFields = requiredFields.filter(
    (field) => req.body[field] == null
  );

  if (!req.file) {
    missingFields.push("image");
  }

  if (missingFields.length > 0) {
    res.status(400);
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }

  const { name } = req.body;

  const existingItem = await Product.findOne({ name });
  if (existingItem) {
    res.status(400);
    throw new Error("Product with similar name already exists!");
  }

  const imageUrl = {
    url: req.file.path,
    public_id: req.file.filename || req.file.public_id,
  };

  const product = await Product.create({ ...req.body, image: imageUrl });
  res.status(201).json(product);
});

// @desc   Update a product
// @route  PUT /api/products/:id
// @access Private (Admin)
export const updateProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const product = await Product.findById(id);
  if (!product) {
    res.status(404);
    throw new Error("Product Not Found");
  }

  if (req.body.name) {
    const existingItem = await Product.findOne({
      name: req.body.name,
      _id: { $ne: id },
    });

    if (existingItem) {
      res.status(400);
      throw new Error("Product with similar name already exists!");
    }
  }

  let imageUrl = product.image;
  if (req.file) {
    //  delete old image from Cloudinary
    try {
      if (product.image?.public_id) {
        await cloudinary.uploader.destroy(product.image.public_id);
      }
    } catch (error) {
      console.error("Error deleting Cloudinary image:", error.message);
    }

    // upload new image
    imageUrl = {
      url: req.file.path,
      public_id: req.file.filename,
    };
  }

  const updatedItem = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(updatedItem);
});

// @desc   Delete a product
// @route  DELETE /api/products/:id
// @access Private (Admin)
export const deleteProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id);

  if (!product) {
    res.status(404);
    throw new Error("Product Not Found");
  }

  // 1. Delete image from Cloudinary (if it exists)
  try {
    if (product.image?.public_id) {
      await cloudinary.uploader.destroy(product.image.public_id);
    }
  } catch (error) {
    console.error("Error deleting Cloudinary image:", error.message);
  }

  // 2. Delete product from MongoDB
  await product.deleteOne();

  res.status(200).json({ message: "Product deleted successfully", id });
});
