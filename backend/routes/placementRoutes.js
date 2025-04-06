const express = require("express");
const router = express.Router();
const { placeItems } = require("../controllers/placementController"); // Ensure correct import

router.post("", placeItems); // Make sure function name matches

module.exports = router;