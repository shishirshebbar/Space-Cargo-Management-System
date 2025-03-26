const Item = require("../models/Item");
const Container = require("../models/Container");

// ✅ Add a new item
exports.addItem = async (req, res) => {
    try {
        const { itemId, name, width, depth, height, mass, priority, expiryDate, usageLimit, preferredZone } = req.body;

        // Find the preferred container
        let container = await Container.findOne({ zone: preferredZone });

        // If no preferred container is found, assign to any available container
        if (!container) {
            container = await Container.findOne();
            if (!container) return res.status(400).json({ success: false, message: "No available container found" });
        }

        const newItem = new Item({
            itemId,
            name,
            width,
            depth,
            height,
            mass,
            priority,
            expiryDate,
            usageLimit,
            preferredZone,
            containerId: container._id
        });

        await newItem.save();
        res.status(201).json({ success: true, message: "Item added successfully", item: newItem });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ✅ Get all items
exports.getItems = async (req, res) => {
    try {
        const items = await Item.find().populate("containerId");
        res.json({ success: true, items });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ✅ Search for an item
exports.searchItem = async (req, res) => {
    try {
        const { itemId } = req.query;
        const item = await Item.findOne({ itemId }).populate("containerId");

        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        res.json({ success: true, item });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ✅ Retrieve an item
exports.retrieveItem = async (req, res) => {
    try {
        const { itemId, userId } = req.body;
        const item = await Item.findOne({ itemId });

        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        // Decrease the usage limit
        item.usageLimit -= 1;
        if (item.usageLimit < 0) {
            return res.status(400).json({ success: false, message: "Item is fully used and cannot be retrieved" });
        }

        await item.save();

        res.json({ success: true, message: "Item retrieved", remainingUses: item.usageLimit });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ✅ Identify expired or fully used items
exports.identifyWaste = async (req, res) => {
    try {
        const now = new Date();
        const wasteItems = await Item.find({
            $or: [{ expiryDate: { $lt: now } }, { usageLimit: { $lte: 0 } }]
        });

        res.json({ success: true, wasteItems });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};