const express = require("express");
const router = express.Router();
const simulationController = require("../controllers/simulationController");


router.post("/day", simulationController.simulateTime);


module.exports = router;
