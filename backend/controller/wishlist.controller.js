const Wishlist = require("../models/wishlist.model");

exports.addWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const { id } = req.user;
    let wishlist = await Wishlist.findOne({ user: id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: id, products: [productId] });
    } else if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
    } else {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    await wishlist.save();
    return res
      .status(201)
      .json({ message: "Product added to wishlist", data: wishlist });
  } catch (error) {
    console.log(error);
  }
};

exports.removeWishlist = async (req, res) => {
  try {
    const { id } = req.user;
    const { productId } = req.params;
    let wishlist = await Wishlist.findOne({ user: id });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }
    wishlist.products = wishlist.products.filter(
      (product) => product.toString() !== productId
    );
    await wishlist.save();
    return res
      .status(200)
      .json({ message: "Product removed from wishlist", data: wishlist });
  } catch (error) {
    console.log(error);
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const { id } = req.user;
    const wishlist = await Wishlist.findOne({ user: id }).populate("products");
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }
    return res
      .status(200)
      .json({ message: "Wishlist retrieved", data: wishlist});
  } catch (error) {
    console.log(error);
  }
};
