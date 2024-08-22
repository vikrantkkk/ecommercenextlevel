const Coupon = require("../models/coupon.model");
const Cart = require("../models/cart.model");

exports.createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountPercentage,
      maxDiscountAmount,
      expiryDate,
      minPurchaseAmount,
      applicableProducts,
      usageLimit,
      usedCount,
      active,
    } = req.body;
    if (!(code && discountPercentage && maxDiscountAmount && expiryDate)) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const coupon = await Coupon.create({
      code,
      discountPercentage,
      maxDiscountAmount,
      expiryDate,
      minPurchaseAmount,
      applicableProducts,
      usageLimit,
      usedCount,
      active,
    });
    return res
      .status(201)
      .json({ message: "Coupon created successfully", data: coupon });
  } catch (error) {
    console.log(error);
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
    const {
      code,
      discountPercentage,
      maxDiscountAmount,
      discountType,
      expiryDate,
      minPurchaseAmount,
      applicableProducts,
      usageLimit,
      usedCount,
      active,
    } = req.body;
    if (!(code && discountPercentage && maxDiscountAmount && expiryDate)) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      couponId,
      {
        code,
        discountPercentage,
        maxDiscountAmount,
        discountType,
        expiryDate,
        minPurchaseAmount,
        applicableProducts,
        usageLimit,
        usedCount,
        active,
      },
      { new: true }
    );
    return res.status(200).json({
      message: "Coupon updated successfully",
      data: updatedCoupon,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getAllCoupon = async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    return res
      .status(200)
      .json({ message: "Coupons fetched successfully", data: coupons });
  } catch (error) {
    console.log(error);
  }
};

exports.applyCoupon = async (req, res) => {
  try {
    const { id } = req.user;
    const { couponCode } = req.body;
    const cart = await Cart.findOne({ user: id }).populate("products.product");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const coupon = await Coupon.findOne({
      code: couponCode,
      active: true,
      expiryDate: { $gte: new Date() },
    });
    if (!coupon) {
      return res.status(404).json({ message: "Invalid or expired coupon" });
    }

    if (cart.totalAmount < coupon.minPurchaseAmount) {
      return res.status(400).json({
        message:
          "Total amount does not meet coupon minimum purchase requirement",
      });
    }
    //Validate applicable products
    const eligibleProducts = cart.products.filter((product) =>
      coupon.applicableProducts.includes(product.product._id)
    );

    if (eligibleProducts.length === 0) {
      return res.status(400).json({
        message: "Coupon not applicable to any products in your cart",
      });
    }

    //Calculate discount
    let discount = 0;
    eligibleProducts.forEach((product) => {
      if (coupon.discountType === "percentage") {
        discount += (product.price * coupon.discountValue) / 100;
      } else {
        discount += coupon.discountValue;
      }
    });

    // Ensure discount does not exceed total amount
    let totalAmount = cart.totalAmount;
    discount = Math.min(discount, totalAmount);

    cart.totalAmount = totalAmount - discount;

    await cart.save();

    return res.status(200).json({
      message: "Coupon applied successfully",
      discount,
      totalAmount: cart.totalAmount,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
    const coupon = await Coupon.findByIdAndDelete(couponId);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    return res
      .status(200)
      .json({ message: "Coupon deleted successfully", data: coupon });
  } catch (error) {
    console.log(error);
  }
};
