const express = require("express");
const {
  dashboard,
  logout,
  signup,
  login,
} = require("../controller/user.controller");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/dashboard", authMiddleware, dashboard);

module.exports = router;
