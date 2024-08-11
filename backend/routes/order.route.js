const express = require("express");
const {
  createOrder,
  getUserOrder,
  updateorder,
  getAllOrder,
  cancelOrder,
} = require("../controller/order.controller");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRole");
const router = express.Router();

router.post("/create-order", authMiddleware, createOrder);
router.get("/get-user-order", authMiddleware, getUserOrder);
router.put("/update-order/:productId", authMiddleware, updateorder);
router.get(
  "/get-all-order",
  authMiddleware,
  authorizeRoles(["admin"]),
  getAllOrder
);
router.get(
  "/get-all-order",
  authMiddleware,
  authorizeRoles(["admin"]),
  getAllOrder
);
router.put(
  "/cancel-order/:orderId",
  authMiddleware,
  authorizeRoles(["admin"]),
  cancelOrder
);

module.exports = router;
