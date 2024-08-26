const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  addWishlist,
  getWishlist,
  removeWishlist,
} = require("../controller/wishlist.controller");

const router = express.Router();

router.post("/add-wishlist", authMiddleware, addWishlist);
router.delete("/remove-wishlist/:productId", authMiddleware, removeWishlist);
router.get("/get-wishlist", authMiddleware, getWishlist);

module.exports = router;
