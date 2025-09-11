import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import AdminRouter from "./routes/admin.route.js";
import ProductRouter from "./routes/product.route.js";
import OrderRouter from "./routes/order.routes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://nike-lac-five.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/products", ProductRouter);
app.use("/api/orders", OrderRouter);
app.use("/api/admin", AdminRouter);

app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

connectDB().then(
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
);
