const Category = require("../models/category.model");
const uploadOnCloudinary = require("../utils/cloudinaryConfig");

exports.createCategory = async (req, res) => {
  try {
    const { name, discription, parentCategory } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    const existcategory = await Category.findOne({ name });
    if (existcategory) {
      return res.status(400).json({ message: "Category already exist" });
    }
    const imageLocalPath = req.file?.path;
    let imageUrl;
    if (imageLocalPath) {
      const images = await uploadOnCloudinary(imageLocalPath);
      if (!images || !images.url) {
        return res.status(400).json({ message: "Failed to upload image" });
      }
      imageUrl = images.url;
    }
    const category = await Category.create({
      name,
      discription,
      parentCategory,
      imageUrl,
    });
    return res
      .status(201)
      .json({ message: "Category created successfully", data: category });
  } catch (error) {
    console.log(error);
  }
};

exports.getAllCategroy = async (req, res) => {
  try {
    const categories = await Category.find({}).populate("parentCategory");
    return res
      .status(200)
      .json({ message: "All Category fethced successfully", data: categories });
  } catch (error) {
    console.log(error);
  }
};

exports.getSigleCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id).populate("parentCategory");
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.log(error);
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, discription, parentCategory } = req.body;
    let updateField = {
      name,
      discription,
      parentCategory,
    };
    const imagefilePath = req.file?.path;
    if (imagefilePath) {
      const images = await uploadOnCloudinary(imagefilePath);
      if (!images || !images.url) {
        return res.status(400).json({ message: "Failed to upload image" });
      }
      updateField = { ...updateField, imageUrl: images.url };
    }
    const category = await Category.findByIdAndUpdate(
      id,
      { $set: updateField },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteCateogry = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.log(error);
  }
};
