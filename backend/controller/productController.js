// backend/controllers/productController.js

const Product = require("../models/product.model");
const uploadOnCloudinary = require("../utils/cloudinaryConfig");
const mongoose = require("mongoose");

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      brand,
      stock,
      attributes,
      sku,
      variants,
      warranty,
      returnPolicy,
      seller,
    } = req.body;

    if (!(name && description && price && stock)) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const imageLocalPath = req.file?.path;

    if (!imageLocalPath) {
      return res.status(400).json({ message: "Image file is missing" });
    }

    const images = await uploadOnCloudinary(imageLocalPath);

    if (!images.url) {
      return res
        .status(400)
        .json({ message: "Error while uploading on image" });
    }

    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      category,
      brand,
      stock,
      images: images.url,
      attributes,
      sku,
      variants,
      warranty,
      returnPolicy,
      seller,
    });

    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Get All Products Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

exports.getSingleProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid Product Id" });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid Product Id" });
    }
    const {
      name,
      discription,
      price,
      discountprice,
      category,
      brand,
      stock,
      sku,
      variants,
      returnPolilcy,
      seller,
    } = req.body;
    const imagePath = req?.file?.path;
    let imageUrl;
    if (imagePath) {
      const images = uploadOnCloudinary(imagePath);
      if (!images || images.url) {
        return res.status(400).json({ message: "Failed to upload image" });
      }
      imageUrl = images.url;
    }

    let updateFiled = {
      name,
      discription,
      price,
      discountprice,
      category,
      brand,
      stock,
      sku,
      variants,
      returnPolilcy,
      seller,
    };

    if (imageUrl) {
      updateFiled.images = imageUrl;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateFiled,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      message: "Product updated successfully",
      date: product,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid Product Id" });
    }
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
