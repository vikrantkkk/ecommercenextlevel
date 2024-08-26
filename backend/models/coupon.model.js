// backend/models/Coupon.js

const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  description: { type: String },
  discountType: { 
    type: String, 
    enum: ["percentage", "fixed"], 
    required: true 
  },
  discountAmount: { type: Number, required: true },
  minPurchaseAmount: { type: Number, default: 0 },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  productRestrictions: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product" 
  }],
  isActive: { type: Boolean, default: true },
  usageLimit: { type: Number, default: 1 },
  timesUsed: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
