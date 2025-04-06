const express = require("express");
const router = express.Router();
const simulationController = require("../controllers/simulationController");

// Simulate time passing (e.g., days) and update item states
router.post("/day", simulationController.simulateTime);


module.exports = router;
