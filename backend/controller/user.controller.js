const User = require("../models/user.model");
exports.signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    res.status(200).json({ data: user });
  } catch (error) {
    console.log(error);
  }
};
