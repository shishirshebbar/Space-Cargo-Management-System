const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");


router.get("/search", itemController.searchItem);


router.post("/retrieve", itemController.retrieveItem);


router.post("/place", itemController.placeItem);

module.exports = router;