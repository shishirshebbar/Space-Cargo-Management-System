const express = require("express");
const router = express.Router();
const wasteController = require("../controllers/wasteController");

// Identify expired or depleted items as waste
router.get("/identify", wasteController.identifyWaste);

// Generate a return plan for waste disposal
router.post("/return-plan", wasteController.generateReturnPlan);

// Complete the waste undocking process
router.post("/complete-undocking", wasteController.completeUndocking);

module.exports = router;