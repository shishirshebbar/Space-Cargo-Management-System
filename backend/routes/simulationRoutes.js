const express = require("express");
const router = express.Router();
const simulationController = require("../controllers/simulationController");

// Simulate time passing (e.g., days) and update item states
router.post("/day", simulationController.simulateTime);

// Get the current state of all items
router.get("/current-state", simulationController.getCurrentState);

module.exports = router;
