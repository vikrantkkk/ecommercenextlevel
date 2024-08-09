const express = require("express");
const { upload } = require("../middleware/uploadFileMiddleware");
const { createCategory } = require("../controller/category.controller");
const router = express.Router();

router.post("/create-category",upload.single("images"), createCategory);

module.exports = router;
