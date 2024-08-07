// backend/routes/productRoutes.js

const express = require("express");
const { upload } = require("../middleware/uploadFileMiddleware");
const { createProduct } = require("../controller/productController");

const router = express.Router();

// Route to create a new product
router.post("/create-product", upload.single("images"), createProduct);

module.exports = router;
