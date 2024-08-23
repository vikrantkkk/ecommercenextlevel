const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRole");
const {
  createCoupon,
  updateCoupon,
  getAllCoupon,
  applyCoupon,
} = require("../controller/coupon.controller");
const router = express.Router();

router.post(
  "/create-coupon",
  authMiddleware,
  authorizeRoles(["admin"]),
  createCoupon
);
router.put("/update-coupon/:couponId", authMiddleware, updateCoupon);
router.get("/get-all-coupon", getAllCoupon);
router.post("/apply-coupon", authMiddleware, applyCoupon);
router.delete(
  "/delete-coupon",
  authMiddleware,
  authorizeRoles(["admin"]),
  applyCoupon
);

module.exports = router;
