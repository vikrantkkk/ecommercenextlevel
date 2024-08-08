const express = require("express");
const {
  logout,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
} = require("../controller/user.controller");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/get-profile", authMiddleware, getUserProfile);
router.put("/update-user-profile", authMiddleware, updateUserProfile);
module.exports = router;
