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
    console.log("🚀 ~ exports.createCategory= ~ imageLocalPath:", imageLocalPath)
    let imageUrl ;
    if (imageLocalPath) {
      const images = await uploadOnCloudinary(imageLocalPath);
      console.log("🚀 ~ exports.createCategory= ~ images:", images)
      if (!images || !images.url) {
        return res.status(400).json({ message: "Failed to upload image" });
      }
      imageUrl = images.url;
    } 
    const category = await Category.create({
      name,
      discription,
      parentCategory,
      image: imageUrl,
    });
    return res
      .status(201)
      .json({ message: "Category created successfully", data: category });
  } catch (error) {
    console.log(error);
  }
};
