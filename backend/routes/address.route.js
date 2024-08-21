const express = require("express");
const {
  createAdress,
  getAddresses,
  updateAddress,
  deleteAddress,
} = require("../controller/address.controller");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create-address", authMiddleware, createAdress);
router.get("/get-address", authMiddleware, getAddresses);
router.put("/update-address/:addressId", authMiddleware, updateAddress);
router.delete("/delete-address/:addressId", authMiddleware, deleteAddress);

module.exports = router;
