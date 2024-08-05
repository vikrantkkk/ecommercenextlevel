const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const authorizeRole = async (req, res, next) => {
  const { id } = req.user;
  const user = User.findById(id);
  try {
    if (!user && !user.role) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = authorizeRole;
