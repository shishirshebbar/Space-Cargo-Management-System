const express = require("express");
const { simulateDays, getSimulationState } = require("../controllers/simulationController");

const router = express.Router();

// ✅ Simulate multiple days (Fast Forward)
router.post("/simulate-days", simulateDays);

// ✅ Get the current state of all items (for mission planning)
router.get("/state", getSimulationState);

module.exports = router;