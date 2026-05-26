const express = require("express");
const router = express.Router();

const {
    googleAuthUrl,
    googleCallback
} = require("../controllers/auth.controller");

router.get("/google", googleAuthUrl);
router.get("/google/callback", googleCallback);

module.exports = router;


// const express = require("express");
// const router = express.Router();

// const { login } = require("../controllers/auth.controller");

// router.post("/login", login);

// module.exports = router;