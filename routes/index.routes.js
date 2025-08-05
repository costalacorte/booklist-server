const router = require("express").Router();

const authRoutes = require("./auth.routes");
router.use("/auth", authRoutes);

// Book routes
const bookRoutes = require("./book.routes");
router.use("/books", bookRoutes);

module.exports = router;
