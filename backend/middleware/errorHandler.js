const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");

// Retrieve logs based on query parameters
router.get("/logs", logController.getLogs);

module.exports = router;