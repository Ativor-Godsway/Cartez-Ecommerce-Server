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

const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://cartez-ecommerce-frontend.vercel.app",
  // production domain
];

// allow preview deployments dynamically (matches *.vercel.app)
app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Incoming request origin:", origin);
      if (!origin) return callback(null, true); // allow server-to-server requests

      if (
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(origin) // regex: allow any *.vercel.app subdomain
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// handle preflight
app.options("*", cors());

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
