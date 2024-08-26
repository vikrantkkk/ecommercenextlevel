const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createInventory,
  updateInventory,
  getInventoryByProduct,
  getAllInventory,
  getLowStockItems,
  updateInventoryQuantity,
} = require("../controller/inventory.controller");
const authorizeRoles = require("../middleware/authorizeRole");
const router = express.Router();

router.post(
  "/create-inventory",
  authMiddleware,
  authorizeRoles("admin"),
  createInventory
);
router.put(
  "/update-inventory/:inventoryId",
  authMiddleware,
  authorizeRoles("admin"),
  updateInventory
);
router.get(
  "/get-inventory-by-product/:productId",
  authMiddleware,
  authorizeRoles("admin"),
  getInventoryByProduct
);
router.get(
  "/get-all-inventory",
  authMiddleware,
  authorizeRoles("admin"),
  getAllInventory
);
router.get(
  "/low-stock-item",
  authMiddleware,
  authorizeRoles("admin"),
  getLowStockItems
);

router.put(
    "/update-inventory-quantity/:inventoryId",
    authMiddleware,
    authorizeRoles("admin"),
    updateInventoryQuantity
  );

module.exports = router;
