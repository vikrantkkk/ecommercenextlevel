const express = require("express");
const { addToCart } = require("../controller/cart.controller");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/add-cart", authMiddleware, addToCart);

module.exports = router;
