const express = require("express");
const router = express.Router();
const { placeItems } = require("../controllers/placementController"); // Ensure correct import

router.post("/place", placeItems); // Make sure function name matches

module.exports = router;