const Inventory = require("../models/inventory.model");
const Product = require("../models/product.model");

exports.createInventory = async (req, res) => {
  try {
    const {
      product,
      quantity,
      warehouseLocation,
      reorderLevel,
      lastRestocked,
      batchNumbers,
      costPrice,
      status,
    } = req.body;
    if (!(product && quantity)) {
      return res
        .status(400)
        .send({ message: "Product ID and Quantity are required." });
    }
    // Ensure the product exists
    const existingProduct = await Product.findById(product);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const inventory = await Inventory.create({
      product,
      quantity,
      warehouseLocation,
      reorderLevel,
      lastRestocked,
      batchNumbers,
      costPrice,
      status,
    });
    res
      .status(201)
      .send({ message: "Inventory created successfully.", inventory });
  } catch (error) {
    console.log(error);
  }
};

exports.updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      product,
      quantity,
      warehouseLocation,
      reorderLevel,
      lastRestocked,
      batchNumbers,
      costPrice,
      status,
    } = req.body;
    const inventory = await Inventory.findByIdAndUpdate(
      id,
      {
        $set: product,
        quantity,
        warehouseLocation,
        reorderLevel,
        lastRestocked,
        batchNumbers,
        costPrice,
        status,
      },
      { new: true }
    );
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    return res
      .status(200)
      .json({ message: "Inventory updated successfully", data: inventory });
  } catch (error) {
    console.log(error);
  }
};

exports.getInventoryByProduct = async (req, res) => {
  try {
    const { product } = req.params;
    const inventory = await Inventory.find({ product: product })
      .populate("product")
      .exec();
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }
    return res
      .status(200)
      .json({ message: "Inventory found", data: inventory });
  } catch (error) {
    console.log(error);
  }
};

exports.getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().populate("product");
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }
    return res.status(200).json({
      message: "All inventories fetched successfully",
      data: inventory,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getLowStockItems = async (req, res) => {
  try {
    const lowStockItems = await Inventory.find({
      quantity: { $lt: reorderLevel },
    }).populate("product");
    return res
      .status(200)
      .json({
        message: "Low stock items fetched successfully",
        data: lowStockItems,
      });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const inventory = await Inventory.findByIdAndDelete(id);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }
    return res
      .status(200)
      .json({ message: "Inventory deleted successfully", data: inventory });
  } catch (error) {
    console.log(error);
  }
};

exports.updateInventoryQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const inventory = await Inventory.findById(id);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    inventory.quantity += quantity;
    inventory.lastRestocked = Date.now(); // Update restocking date

    await inventory.save();

    return res
      .status(200)
      .json({
        message: "Inventory quantity updated successfully",
        data: inventory,
      });
  } catch (error) {
    console.log(error);
  }
};
