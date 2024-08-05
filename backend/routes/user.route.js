const express = require("express");
const {
  signupUser,
  dashboard,
  logout,
} = require("../controller/user.controller");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signupUser);
router.get("/logout", logout);
router.get("/dashboard", authMiddleware, dashboard);

module.exports = router;
