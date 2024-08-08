// backend/routes/productRoutes.js
const express = require("express");
const { upload } = require("../middleware/uploadFileMiddleware");
const {
  createProduct,
  updateProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
} = require("../controller/productController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRole");

const router = express.Router();

// Route to create a new product
router.post(
  "/create-product",
  authMiddleware,
  upload.single("images"),
  createProduct
);
router.get("/get-all-product", getAllProducts);
router.get("/get-single-product/:id", authMiddleware, getSingleProduct);
router.put(
  "/update-product/:id",
  authMiddleware,
  upload.single("images"),
  updateProduct
);
router.delete("/delete-product/:id",authMiddleware, authorizeRoles(["admin"]), deleteProduct);
module.exports = router;
