import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import express from "express";
import path from "path";
import { dbConnection } from "./src/config/dbConfig.js";

const app = express();
const PORT = process.env.PORT || 8000;
// const __dirname = path.resolve();

// 🧠 Connect to MongoDB
dbConnection();

// 📦 Stripe Webhook (MUST be before express.json)
import stripeHook from "./src/routers/client/stripeWebHooks.js";
app.use("/api/v1/client/stripewebhook", express.raw({ type: "application/json" }));
app.use("/api/v1/client/stripewebhook", stripeHook);

// 🌐 Middleware
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// 🔐 Admin Auth Middleware (reused below)
import { adminAuth } from "./src/middlewares/admin/auth-middleware/authMiddleware.js";

// =======================
// 📁 Client API Routes
// =======================
import clientCategoriesRouter from "./src/routers/client/categoriesRouter.js";
import clientProductsRouter from "./src/routers/client/productsRouter.js";
import clientItemsRouter from "./src/routers/client/itemsRouter.js";
import clientUsersRouter from "./src/routers/client/usersRouter.js";
import cartRouter from "./src/routers/client/cartRouter.js";
import favRouter from "./src/routers/client/favRouter.js";
import paymentRouter from "./src/routers/client/paymentRouter.js";
import australiaPost from "./src/routers/client/australiaPost.js";

app.use("/api/v1/client/categories", clientCategoriesRouter);
app.use("/api/v1/client/products", clientProductsRouter);
app.use("/api/v1/client/items", clientItemsRouter);
app.use("/api/v1/client/users", clientUsersRouter);
app.use("/api/v1/client/cart", cartRouter);
app.use("/api/v1/client/favs", favRouter);
app.use("/api/v1/client/payment", paymentRouter);
app.use("/api/v1/client/delivery", australiaPost);

// =======================
// 📁 Admin (CMS) API Routes
// =======================
import adminUserRouter from "./src/routers/admin/adminUserRouter.js";
import adminCategoriesRouter from "./src/routers/admin/categoriesRouter.js";
import adminProductsRouter from "./src/routers/admin/productsRouter.js";
import adminItemRouter from "./src/routers/admin/itemRouter.js";
import paymentMethodsRouter from "./src/routers/admin/paymentMethodsRouter.js";
import adminOrderRouter from "./src/routers/admin/orderRouter.js";
import adminReviewRouter from "./src/routers/admin/reviewsRouter.js";
import adminUsersRouter from "./src/routers/admin/usersRouter.js";

app.use("/api/v1/admin/users", adminUsersRouter);
app.use("/api/v1/admin/admin-user", adminUserRouter);
app.use("/api/v1/admin/categories", adminAuth, adminCategoriesRouter);
app.use("/api/v1/admin/products", adminProductsRouter);
app.use("/api/v1/admin/items", adminAuth, adminItemRouter);
app.use("/api/v1/admin/payment-methods", adminAuth, paymentMethodsRouter);
app.use("/api/v1/admin/orders", adminAuth, adminOrderRouter);
app.use("/api/v1/admin/reviews", adminAuth, adminReviewRouter);

// ✅ Healthcheck Route
app.get("/", (req, res) => {
  res.json({ status: "success", message: "Unified API server root hit" });
});

// 🛑 Error Handlers
app.use((error, req, res, next) => {
  console.log(error);
  const statusCode = error.status || 404;
  res.status(statusCode).json({
    status: "error",
    message: error.message,
  });
});
app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`server running on http://localhost:${PORT}`);
});