const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountPercentage: { type: Number, required: true },
    maxDiscountAmount: { type: Number, required: true }, // Maximum discount amount
    expiryDate: { type: Date, required: true },
    minPurchaseAmount: { type: Number }, // Minimum purchase amount required to use the coupon
    applicableProducts: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    ], // Products where the coupon can be applied
    usageLimit: { type: Number, default: 1 }, // How many times the coupon can be used
    usedCount: { type: Number, default: 0 }, // How many times the coupon has been used
    active: { type: Boolean, default: true }, // Whether the coupon is active
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
