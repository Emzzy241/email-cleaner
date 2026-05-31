const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const { getEmails, cleanupEmails } = require("../controllers/email.controller");

// Removing jwt for now to test gmail integrations
router.get("/", getEmails); // currently removed jwt just for the goal of testing things out 
// router.get("/", authMiddleware, getEmails);

router.post("/cleanup", cleanupEmails);

module.exports = router;