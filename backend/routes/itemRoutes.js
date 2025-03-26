const express = require("express");
const {
    addItem,
    getItems,
    searchItem,
    retrieveItem,
    identifyWaste
} = require("../controllers/itemController");

const router = express.Router();

// ✅ Add a new item
router.post("/add", addItem);

// ✅ Get all items
router.get("/", getItems);

// ✅ Search for an item by itemId
router.get("/search", searchItem);

// ✅ Retrieve an item (decrement usage limit)
router.post("/retrieve", retrieveItem);

// ✅ Identify expired or fully used items
router.get("/waste", identifyWaste);

module.exports = router;