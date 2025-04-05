const Item = require("../models/Item");
const Container = require("../models/Container");

/**
 * Search for an item by ID or name.
 * If found, returns item details and retrieval steps.
 */
exports.searchItem = async (req, res) => {
  try {
    const { itemId, itemName } = req.body;

    if (!itemId && !itemName) {
      return res.status(400).json({ success: false, message: "Provide itemId or itemName" });
    }

    let query = {};
    if (itemId) {
      query.itemId = { $regex: new RegExp(`^${itemId}$`, "i") };  // Case-insensitive & flexible ID matching
    } else {
      query.name = { $regex: new RegExp(`^${itemName}$`, "i") };  // Case-insensitive name search
    }

    console.log("🔍 Search Query:", query);

    const item = await Item.findOne(query);

    if (!item) {
      return res.json({ success: true, found: false });
    }

    res.json({
      success: true,
      found: true,
      item,
      retrievalSteps: [
        { step: 1, action: "remove", itemId: item.itemId, itemName: item.name },
        { step: 2, action: "retrieve", itemId: item.itemId, itemName: item.name },
      ],
    });
  } catch (error) {
    console.error("❌ Search Error:", error);
    res.status(500).json({ success: false, message: "Failed to search for item" });
  }
};


/**
 * Retrieves an item (increments usage count and removes if expired or out of uses).
 */
exports.retrieveItem = async (req, res) => {
  try {
    const { itemId} = req.body;

    const item = await Item.findOne({ itemId });
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    item.usageLimit -= 1;

    if (item.usageLimit <= 0) {
      await Item.deleteOne({ itemId });
    } else {
      await item.save();
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Retrieval Error:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve item" });
  }
};

/**
 * Places an item into a specified container with coordinates.
 */
exports.placeItem = async (req, res) => {
  try {
    const { itemId, userId, timestamp, containerId, position } = req.body;

    const item = await Item.findOne({ itemId });
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    const container = await Container.findOne({ containerId });
    if (!container) return res.status(404).json({ success: false, message: "Container not found" });

    item.containerId = containerId;
    item.position = position;
    await item.save();

    res.json({ success: true });
  } catch (error) {
    console.error("Placement Error:", error);
    res.status(500).json({ success: false, message: "Failed to place item" });
  }
};
