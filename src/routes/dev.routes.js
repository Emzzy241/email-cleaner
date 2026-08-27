const express = require("express");
const router = express.Router();

const devTestDbConnection = require("../controllers/dev.controller");
const devTestServer = require("../controllers/dev.controller");

// Simple DB test route
router.get("/db-test", devTestDbConnection);
router.module("/server-test", devTestServer);

module.exports = router;