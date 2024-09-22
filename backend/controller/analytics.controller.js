const User = require("../models/user.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");

exports.getAnalyticsData = async (req, res) => {
  try {
    const { days } = req.query;

    // Create a date filter if days are provided
    let dateFilter = {};
    if (days) {
      const targetDate = new Date(); // current date //22/09/24
      targetDate.setDate(targetDate.getDate() - parseInt(days));
      dateFilter = { createdAt: { $gte: targetDate } };
    }

    const totalUsers = await User.countDocuments(dateFilter);
    const totalProducts = await Product.countDocuments(dateFilter);

    // Aggregate sales and revenue data based on the date filter
    const salesData = await Order.aggregate([
      { $match: dateFilter },
      {
        $unwind: "$products", 
      },
      {
        $group: {
          _id: null, 
          totalSales: { $sum: "$products.quantity" }, 
          totalRevenue: { $sum: { $multiply: ["$products.quantity", "$products.price"] } }, 

        },
      },
    ]);

    const { totalSales = 0, totalRevenue = 0 } = salesData.length ? salesData[0] : {};

    res.status(200).json({
      users: totalUsers,
      products: totalProducts,
      totalSales,
      totalRevenue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
