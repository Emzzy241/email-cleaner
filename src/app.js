const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const emailRoutes = require("./routes/email.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // automatically convert JSON requests into javascript objects

// Routes
app.use("/auth", authRoutes);
app.use("/emails", emailRoutes);

module.exports = app;