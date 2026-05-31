const express = require("express");
const router = express.Router();

const devTestDbConnection = require("../controllers/dev.controller");

// Simple DB test route
router.get("/db-test", devTestDbConnection);

module.exports = router;