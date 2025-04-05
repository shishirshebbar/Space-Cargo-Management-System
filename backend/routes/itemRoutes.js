const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");

// Item Search API
router.post("/search", itemController.searchItem);

// Item Retrieval API
router.post("/retrieve", itemController.retrieveItem);

// Item Placement API (after retrieval)
router.post("/place", itemController.placeItem);

module.exports = router;