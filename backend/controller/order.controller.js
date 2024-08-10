const Order = require("../models/order.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");

exports.createOrder = async (req, res) => {
  try {
    // adrressid not saved yet beacause of address controller not made yest
    const { id } = req.user;
    const { products, address, transactionId } = req.body;
    const user = await User.findById(id);
    let orderProduct = [];
    let totalAmount = 0;
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: "productId not found" });
      }
      orderProduct.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
      totalAmount += product.price * item.quantity;
    }
    const createOrder =await Order.create({
      user: user._id,
      products: orderProduct,
      totalAmount,
      paymentStatus: transactionId ? "completed" : "pending", 
      orderStatus: "pending",
      transactionId,
    });
    res.json({ message: "Order created successfully", data: createOrder });
  } catch (error) {
    console.error(error);
  }
};
