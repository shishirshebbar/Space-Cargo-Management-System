const express = require("express");
const router = express.Router();
const wasteController = require("../controllers/wasteController");

router.get("/identify", wasteController.identifyWaste);
router.post("/return-plan", wasteController.generateReturnPlan);


router.post("/complete-undocking", wasteController.completeUndocking);

module.exports = router;