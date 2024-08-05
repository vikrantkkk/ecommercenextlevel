// backend/models/Category.js

const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
