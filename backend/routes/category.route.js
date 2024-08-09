const express = require("express");
const { upload } = require("../middleware/uploadFileMiddleware");
const {
  createCategory,
  getAllCategroy,
  getSigleCategory,
  updateCategory,
  deleteCateogry,
} = require("../controller/category.controller");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRole");
const router = express.Router();

router.post("/create-category", upload.single("images"), createCategory);
router.get("/get-all-category", getAllCategroy);
router.get("/get-single-category/:id", authMiddleware, getSigleCategory);
router.put(
  "/update-category/:id",
  authMiddleware,
  upload.single("images"),
  updateCategory
);
router.delete(
  "/delete-category/:id",
  authMiddleware,
  authorizeRoles(["admin"]),
  deleteCateogry
);

module.exports = router;
