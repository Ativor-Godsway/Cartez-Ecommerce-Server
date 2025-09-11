import express from "express";
import { protect } from "../middleware/auth.js";
import {
  addProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import { upload } from "../middleware/upload.js";

const ProductRouter = express.Router();

ProductRouter.route("/")
  .get(getProducts)
  .post(protect, upload.single("image"), addProduct);
ProductRouter.route("/:id")
  .get(getProduct)
  .put(protect, upload.single("image"), updateProduct)
  .delete(protect, deleteProduct);

export default ProductRouter;
