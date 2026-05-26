const express = require("express");
const { healthCheck } = require("../controllers/health.controller");

const router = express.Router();

router.get("/", healthCheck);

console.log("Reading the health.routes file");


module.exports = router;