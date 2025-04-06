const Item = require("../models/Item");
const Container = require("../models/Container");

const Waste = require("../models/Waste");

/**
 * Search for an item by ID or name.
 * If found, returns item details and retrieval steps.
 */
exports.searchItem = async (req, res) => {
  try {
    const { itemId, itemName } = req.query; // ✅ Use query params for GET

    if (!itemId && !itemName) {
      return res.status(400).json({ success: false, message: "Provide itemId or itemName" });
    }

    let query = {};

    if (itemId) {
      query.itemId = itemId.trim(); // ✅ Trim input to avoid space issues
    } else {
      query.name = { $regex: new RegExp(itemName, "i") };
    }

    console.log("🔍 Search Query:", query);

    const item = await Item.findOne(query);
    console.log("🧾 Found Item:", item);

    if (!item) {
      return res.json({ success: true, found: false });
    }

    const { itemId: foundItemId, name, containerId, zone, position } = item;

    res.json({
      success: true,
      found: true,
      item: {
        itemId: foundItemId,
        name,
        containerId,
        zone,
        position,
      },
      retrievalSteps: [
        { step: 1, action: "remove", itemId: foundItemId, itemName: name },
        { step: 2, action: "retrieve", itemId: foundItemId, itemName: name },
      ],
    });
  } catch (error) {
    console.error("❌ Search Error:", error);
    res.status(500).json({ success: false, message: "Failed to search for item" });
  }
};





exports.retrieveItem = async (req, res) => {
  try {
    console.log("📥 Incoming retrieve request:", req.body);

    const { itemId, userId, timestamp } = req.body;

    if (!itemId || !timestamp) {
      console.warn("⚠️ Missing required fields:", { itemId, timestamp });
      return res.status(400).json({ success: false, message: "itemId and timestamp are required" });
    }

    const item = await Item.findOne({ itemId });
    if (!item) {
      console.warn(`❌ Item not found for itemId: ${itemId}`);
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    console.log("🔍 Found item:", item);

    // Decrement usage
    item.usageLimit -= 1;
    console.log(`🔧 Decremented usageLimit for itemId ${itemId}: now ${item.usageLimit}`);

    if (item.usageLimit <= 0) {
      console.log(`⚠️ usageLimit <= 0, moving item ${itemId} to waste.`);

      const defaultPosition = {
        startCoordinates: { width: 0, depth: 0, height: 0 },
        endCoordinates: { width: 0, depth: 0, height: 0 }
      };
      
      const position = (item.position &&
                        item.position.startCoordinates &&
                        item.position.endCoordinates &&
                        typeof item.position.startCoordinates.width === 'number' &&
                        typeof item.position.startCoordinates.depth === 'number' &&
                        typeof item.position.startCoordinates.height === 'number' &&
                        typeof item.position.endCoordinates.width === 'number' &&
                        typeof item.position.endCoordinates.depth === 'number' &&
                        typeof item.position.endCoordinates.height === 'number')
        ? item.position
        : defaultPosition;
      

      const wasteItem = {
        itemId: item.itemId,
        name: item.name,
        reason: "Out of Uses",
        containerId: item.containerId || "Unknown",
        position
      };

      console.log("🗑️ Prepared wasteItem:", wasteItem);

      let wasteDoc = await Waste.findOne({ disposalStatus: "Pending" });
      console.log("📂 Fetched existing wasteDoc:", wasteDoc ? "Found" : "Not Found");

      if (!wasteDoc) {
        wasteDoc = new Waste({ wasteItems: [wasteItem] });
        console.log("📄 Creating new Waste document...");
      } else {
        wasteDoc.wasteItems.push(wasteItem);
        console.log("➕ Added wasteItem to existing waste document.");
      }

      await wasteDoc.save();
      console.log("💾 Waste document saved successfully.");

      await Item.deleteOne({ itemId });
      console.log(`🗑️ Deleted item ${itemId} from Item collection.`);

      console.log(`✅ Item ${itemId} moved to waste by user ${userId || "N/A"} at ${timestamp}`);
      return res.json({ success: true, message: "Item retrieved and moved to waste" });
    }

    // Still usable
    await item.save();
    console.log(`✅ Item ${itemId} retrieved successfully. usageLimit: ${item.usageLimit}`);

    res.json({ success: true, message: "Item retrieved successfully" });
  } catch (error) {
    console.error("❌ Retrieval Error:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve item" });
  }
};


/**
 * Places an item into a specified container with coordinates.
 */
exports.placeItem = async (req, res) => {
  try {
    const { itemId, userId, timestamp, containerId, position } = req.body;

    if (!itemId || !containerId || !position || !timestamp) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    const item = await Item.findOne({ itemId });
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    const container = await Container.findOne({ containerId });
    if (!container) return res.status(404).json({ success: false, message: "Container not found" });

    // Update item's container and position
    item.containerId = containerId;
    item.position = position;
    await item.save();

    // Optional: log the action
    console.log(`✅ Item ${itemId} placed by ${userId || "N/A"} at ${timestamp} in ${containerId}`);

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Placement Error:", error);
    res.status(500).json({ success: false, message: "Failed to place item" });
  }
};
