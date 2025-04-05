const express = require("express");
const router = express.Router();
const importExportController = require("../controllers/importExportController");
const multer = require("multer");

// Configure multer for file uploads (CSV)
const upload = multer({ dest: "uploads/" });

// Debugging: Confirm route file is loaded
console.log("✅ ImportExportRoutes initialized");

// Middleware to check if the route is reached
router.post("/items", upload.single("file"), (req, res, next) => {
    console.log("📩 Received request to /api/import/items");
    next();
}, importExportController.importItems);

// 🔥 FIX: Add Route for Importing Containers
router.post("/containers", upload.single("file"), (req, res, next) => {
    console.log("📩 Received request to /api/import/containers");
    next();
}, importExportController.importContainers);

module.exports = router;
