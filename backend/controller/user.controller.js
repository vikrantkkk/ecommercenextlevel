const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

exports.signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!(name && email && password)) {
      res.status(401).json({ message: "please fill all the details" });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({ mesage: "invalid passowod format" });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ mesage: "invalid email format" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) res.status(400).json({ message: "user already exist" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, { httpOnly: true });
    res
      .status(201)
      .json({ message: "user created successfully", data: user, token });
  } catch (error) {
    console.log(error);
  }
};

exports.dashboard = async (req, res) => {
  try {
    return res.status(200).json({ message: "middleware wokring perfectly" });
  } catch (error) {
    console.log(error);
  }
};
exports.logout = async (req, res) => {
  try {
    res.cookie("token", "", { expires: new Date(0), httpOnly: true });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
  }
};
