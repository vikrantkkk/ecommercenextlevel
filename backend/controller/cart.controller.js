const User = require("../models/user.model");
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");

exports.addToCart = async (req, res) => {
  try {
    const { id } = req.user;
    const { productId, quantity, variant } = req.body;
    if (!variant || !variant.color || !variant.size) {
      return res
        .status(400)
        .json({ message: "Variant is required with color and size" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock" });
    }
    //find the user cart and if cart not present then create a cart for user
    let cart = await Cart.findOne({ user: id });
    if (!cart) {
      cart = new Cart({ user: id, products: [] });
    }
    //check if the same varient of  product alreay in your cart
    const productIndex = cart.products.findIndex((p) => {
      return (
        p.product.toString() === productId &&
        p.variant.color === variant.color &&
        p.variant.size === variant.size
      );
    });

    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({
        product: productId,
        variant,
        quantity,
      });
    }

    let totalAmount = 0;
    for (const item of cart.products) {
      const product = await Product.findById(item.product);
      totalAmount += product.price * item.quantity;
    }
    cart.totalAmount = totalAmount;

    await cart.save();

    const user = await User.findById(id);
    if (!user.cart) {
      user.cart = cart._id;
      await user.save();
    }

    return res
      .status(200)
      .json({ message: "Product added to cart", data: cart });
  } catch (error) {
    console.log(error);
  }
};

exports.usercart = async (req, res) => {
  try {
    const { id } = req.user;
    const cart = await Cart.findOne({ user: id }).populate("products.product");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    return res.status(200).json({ message: "cart", data: cart });
  } catch (error) {
    console.log(error);
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { productId, variant, quantity } = req.body;
    const { id } = req.user;

    const cart = await Cart.findOne({ user: id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (quantity > product.stock) {
      return res.status(400).json({ message: "Product is out of stock" });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Update the existing variant or replace with new variant
    if (
      cart.products[productIndex].variant.color === variant.color &&
      cart.products[productIndex].variant.size === variant.size
    ) {
      cart.products[productIndex].quantity = quantity;
    } else {
      cart.products[productIndex].variant.color = variant.color;
      cart.products[productIndex].variant.size = variant.size;
      cart.products[productIndex].quantity = quantity;
    }

    // Recalculate total amount
    let totalAmount = 0;
    for (const item of cart.products) {
      const product = await Product.findById(item.product);
      totalAmount += product.price * item.quantity;
    }
    cart.totalAmount = totalAmount;

    await cart.save();
    return res
      .status(200)
      .json({ message: "Cart updated successfully", data: cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while updating the cart" });
  }
};

exports.removeCart = async (req, res) => {
  try {
    const { id } = req.user; // Assuming user ID comes from auth middleware
    const { productId } = req.body; // Product ID to remove

    const cart = await Cart.findOne({ user: id }).populate("products.product");

    if (cart) {
      cart.products = cart.products.filter(
        (item) => item.product._id.toString() !== productId
      );

      await cart.save();
      return res.status(200).json({ message: "Product removed", data: cart });
    } else {
      return res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
