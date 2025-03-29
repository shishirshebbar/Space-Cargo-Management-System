const Item = require("../models/Item");
const Container = require("../models/Container");

// ✅ Get the current state of all items (for mission planning)
exports.identifyWaste = async (req, res) => {
    try {
        const now = new Date();
        const wasteItems = await Item.find({
            $or: [{ expiryDate: { $lt: now } }, { usageLimit: { $lte: 0 } }]
        }).populate("containerId");

        res.json({ success: true, wasteItems });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ✅ Move waste items to undocking module
exports.moveWasteToUndocking = async (req, res) => {
    try {
        const { undockingContainerId } = req.body;

        const undockingContainer = await Container.findOne({ containerId: undockingContainerId });
        if (!undockingContainer) {
            return res.status(404).json({ success: false, message: "Undocking container not found" });
        }

        const now = new Date();
        const wasteItems = await Item.find({
            $or: [{ expiryDate: { $lt: now } }, { usageLimit: { $lte: 0 } }]
        });

        for (let item of wasteItems) {
            item.containerId = undockingContainer._id;
            await item.save();
        }

        res.json({ success: true, message: "Waste moved to undocking container", itemsMoved: wasteItems.length });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ✅ Generate waste return manifest
exports.generateReturnManifest = async (req, res) => {
    try {
        const now = new Date();
        const wasteItems = await Item.find({
            $or: [{ expiryDate: { $lt: now } }, { usageLimit: { $lte: 0 } }]
        });

        let totalWeight = wasteItems.reduce((sum, item) => sum + item.mass, 0);
        let totalVolume = wasteItems.reduce((sum, item) => sum + (item.width * item.depth * item.height), 0);

        res.json({
            success: true,
            returnManifest: {
                returnItems: wasteItems.map(item => ({
                    itemId: item.itemId,
                    name: item.name,
                    reason: item.usageLimit <= 0 ? "Used Up" : "Expired"
                })),
                totalWeight,
                totalVolume
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ✅ Complete waste undocking (delete waste items)
exports.completeUndocking = async (req, res) => {
    try {
        const now = new Date();
        const wasteItems = await Item.find({
            $or: [{ expiryDate: { $lt: now } }, { usageLimit: { $lte: 0 } }]
        });

        const removedCount = wasteItems.length;
        await Item.deleteMany({
            $or: [{ expiryDate: { $lt: now } }, { usageLimit: { $lte: 0 } }]
        });

        res.json({ success: true, message: "Waste undocking complete", itemsRemoved: removedCount });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};