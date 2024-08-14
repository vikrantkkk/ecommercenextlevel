const express = require("express");
const {
  addToCart,
  usercart,
  updateCart,
  removeCart,
} = require("../controller/cart.controller");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/add-cart", authMiddleware, addToCart);
router.get("/user-cart", authMiddleware, usercart);
router.put("/update-cart", authMiddleware, updateCart);
router.delete("/remove-cart", authMiddleware, removeCart);

module.exports = router;
