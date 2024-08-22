const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  addWishlist,
  getWishlist,
  removeWishlist,
} = require("../controller/wishlist.controller");

const router = express.Router();

router.post("/add-wishlist", authMiddleware, addWishlist);
router.post("/add-wishlist/:productId", authMiddleware, removeWishlist);
router.get("/get-wishlist", authMiddleware, getWishlist);

module.exports = router;
