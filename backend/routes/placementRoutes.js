const express = require("express");
const router = express.Router();
const { placeItems } = require("../controllers/placementController"); 

router.post("", placeItems); 

module.exports = router;