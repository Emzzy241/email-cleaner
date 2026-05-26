const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const { getEmails } = require("../controllers/email.controller");

// Removing jwt for now to test gmail integrations
router.get("/", getEmails);
// router.get("/", authMiddleware, getEmails);

module.exports = router;