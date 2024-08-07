// backend/controllers/productController.js

const Product = require("../models/product.model");
const uploadOnCloudinary = require("../utils/cloudinaryConfig");

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
      throw new ApiError(400, "Image file is missing");
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
