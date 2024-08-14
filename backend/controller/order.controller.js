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
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: "Not enough stock available" });
      }

      if (transactionId) {
        product.stock -= item.quantity;
        await product.save();
      }
      orderProduct.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
      totalAmount += product.price * item.quantity;
    }
    const createOrder = await Order.create({
      user: user._id,
      products: orderProduct,
      totalAmount,
      paymentStatus: transactionId ? "completed" : "pending",
      orderStatus: "pending",
      transactionId,
    });
    user.orders.push(createOrder._id);
    await user.save();
    res.json({ message: "Order created successfully", data: createOrder });
  } catch (error) {
    console.error(error);
  }
};

exports.getUserOrder = async (req, res) => {
  try {
    const { id } = req.user;
    const orders = await Order.find({ user: id }).populate("products.product");
    if (!orders) {
      return res.status(404).json({ message: "No orders found for this user" });
    }
    res.status(200).json({ message: "User orders", data: orders });
  } catch (error) {
    console.log(error);
  }
};

exports.updateorder = async (req, res) => {
  try {
    const { products, address, orderStatus, paymentStatus } = req.body;
    const { productId } = req.params;
    const { id } = req.user;
    const user = await User.findById(id);
    const order = await Order.findById(productId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      order.user.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this order" });
    }

    let updateProducts = [];

    let totalAmount = 0;

    if (products) {
      for (const item of products) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(400).json({ message: "productId not found" });
        }
        updateProducts.push({
          product: product._id,
          quantity: item.quantity,
          price: product.price,
        });
        totalAmount += product.price * item.quantity;
      }
      order.products = updateProducts;
      order.totalAmount = totalAmount;
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }
    // if (address) {
    //   order.address = address;
    // }
    const updatedOrder = await order.save();
    res
      .status(200)
      .json({ message: "Order updated successfully", data: updatedOrder });
  } catch (error) {
    console.log(error);
  }
};

exports.getAllOrder = async (req, res) => {
  try {
    const order = await Order.find({});
    if (!order) {
      return res.status(404).json({ message: "No orders found" });
    }
    res
      .status(200)
      .json({ message: "Orders fetched successfully", data: order });
  } catch (error) {
    console.log(error);
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.user;
    const { orderId } = req.params;
    const user = await User.findById(id);
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (
      order.user.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to cancel this order" });
    }
    if (order.orderStatus === "completed") {
      return res
        .status(403)
        .json({ message: "Completed orders cannot be canceled" });
    }
    order.orderStatus = "cancelled";
    //revert in stock
    for (const item of order.products) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }
    const updatedOrder = await order.save();
    res
      .status(200)
      .json({ message: "Order canceled successfully", data: updatedOrder });
  } catch (error) {}
};
