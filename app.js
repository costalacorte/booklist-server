//  Gets access to environment variables/settings
require("dotenv").config();

// Connects to the database
require("./db");

const express = require("express");
const app = express();

// Load middlewares
require("./config")(app);

// Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

// Error handler
require("./error-handling")(app);

module.exports = app;
