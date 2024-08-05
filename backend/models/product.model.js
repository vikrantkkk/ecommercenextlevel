// backend/models/Product.js

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number }, 
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    brand: { type: String },
    stock: { type: Number, required: true },
    images: [{ type: String }], // URLs or file paths to images
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    attributes: {
      color: { type: String },
      size: { type: String },
      weight: { type: String },
    },
    sku: { type: String, unique: true },
    variants: [
      {
        color: { type: String },
        size: { type: String },
        stock: { type: Number },
      },
    ],
    warranty: { type: String },
    returnPolicy: { type: String },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

productSchema.methods.getDiscountPercentage = function () {
  if (!this.discountPrice || this.discountPrice >= this.price) return 0;
  return Math.round(((this.price - this.discountPrice) / this.price) * 100);
};

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
