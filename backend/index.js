const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/user.route");
const productRoute = require("./routes/product.route");
const categoryRoute = require("./routes/category.route");
const orderRoute = require("./routes/order.route");
const cartRoute = require("./routes/cart.route");
const addressRoute = require("./routes/address.route");
const couponRoute = require("./routes/coupon.route");
const wishlistRoute = require("./routes/wishlist.route");
const inventoryRoute = require("./routes/inventoy.route");
const path = require("path");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: "GET,PUT,POST,DELETE",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("database connected successfully");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/address", addressRoute);
app.use("/api/v1/coupon", couponRoute);
app.use("/api/v1/wishlist", wishlistRoute);
app.use("/api/v1/inventory", inventoryRoute);

app.get("/", (req, res) => {
  res.status(200).json({ message: "done" });
});
