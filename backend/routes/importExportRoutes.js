const express = require("express");
const router = express.Router();
const importExportController = require("../controllers/importExportController");
const multer = require("multer");


const upload = multer({ dest: "uploads/" });


console.log("✅ ImportExportRoutes initialized");


router.post("/items", upload.single("file"), (req, res, next) => {
    console.log("📩 Received request to /api/import/items");
    next();
}, importExportController.importItems);


router.post("/containers", upload.single("file"), (req, res, next) => {
    console.log("📩 Received request to /api/import/containers");
    next();
}, importExportController.importContainers);

router.get("/arrangement", importExportController.exportArrangement);


module.exports = router;
