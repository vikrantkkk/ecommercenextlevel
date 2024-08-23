const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true },
    warehouseLocation: { type: String },
    reorderLevel: { type: Number, default: 10 }, // Notification for low stock
    lastRestocked: { type: Date }, // Track the last restocking date
    batchNumbers: [
      {
        batchId: { type: String },
        expirationDate: { type: Date },
        quantity: { type: Number },
      },
    ], // For managing product batches
    costPrice: { type: Number }, // For calculating profit margins
    status: {
      type: String,
      enum: ["in_stock", "out_of_stock", "discontinued"],
      default: "in_stock",
    }, // Track the status of the product
  },
  { timestamps: true }
);

const Inventory = mongoose.model("Inventory", inventorySchema);
module.exports = Inventory;
