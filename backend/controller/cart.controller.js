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
