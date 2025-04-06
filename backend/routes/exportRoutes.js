const express = require("express");
const router = express.Router();
const importExportController = require("../controllers/importExportController");
const multer = require("multer");

router.get("/arrangement", importExportController.exportArrangement);

module.exports = router;
