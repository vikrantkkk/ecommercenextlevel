const express = require("express");
const { getAnalyticsData } = require("../controller/analytics.controller");
const router = express.Router();

router.get("/get-analytics", getAnalyticsData);

module.exports = router;
