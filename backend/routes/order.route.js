const express = require("express");
const { createOrder } = require("../controller/order.controller");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/create-order", authMiddleware, createOrder);

module.exports = router;
