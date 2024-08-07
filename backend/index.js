const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/user.route");
const productRoute = require("./routes/productRoutes");
const path = require("path");

const app = express();
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

app.get("/", (req, res) => {
  res.status(200).json({ message: "done" });
});
