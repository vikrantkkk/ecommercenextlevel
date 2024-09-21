const User = require("../models/user.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");

exports.getAnalyticsData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const salesData = Order.aggregate([
      {
        $group: {
          _id: null, //it group all documents together
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const { totalSales, totalRevenue } = salesData[0] || {
      totalSales: 0,
      totalRevenue: 0,
    };

    res.status(200).json({
      users: totalUsers,
      products: totalProducts,
      totalSales,
      totalRevenue,
    });
  } catch (error) {
    console.log(error);
  }
};
