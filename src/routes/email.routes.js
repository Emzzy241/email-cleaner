const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const { getEmails, cleanupEmails, getCleanupStatus, getAllCleanupStatus, cleanupOldEmails } = require("../controllers/email.controller");

// Removing jwt for now to test gmail integrations
router.get("/", getEmails); // currently removed jwt just for the goal of testing things out 
// router.get("/", authMiddleware, getEmails);

router.get("/cleanup-jobs/:id", getCleanupStatus);
router.get("/cleanup-all-jobs", getAllCleanupStatus); // status for all jobs currently being cleaned up.

router.post("/cleanup", cleanupEmails);
router.post("/cleanup/old-emails", cleanupOldEmails);


// gotta start making routes for some reviews actually
// some "REVIEW" FOR EMAIL ARE PRETTY MUCH LIKE SPAMS Honestly.

module.exports = router;