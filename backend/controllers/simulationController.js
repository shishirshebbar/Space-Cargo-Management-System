const Item = require("../models/Item");

// ✅ Simulate time passing (Fast Forward X Days)
exports.simulateDays = async (req, res) => {
    try {
        const { numOfDays } = req.body;
        if (!numOfDays || numOfDays < 1) {
            return res.status(400).json({ success: false, message: "Number of days must be at least 1" });
        }

        const now = new Date();
        const futureDate = new Date();
        futureDate.setDate(now.getDate() + numOfDays);

        // Update item usage limits and mark expired items as waste
        const expiredItems = await Item.find({ expiryDate: { $lt: futureDate } });
        const updatedItems = await Item.updateMany({}, { $inc: { usageLimit: -numOfDays } });

        res.json({
            success: true,
            message: `Simulated ${numOfDays} days`,
            changes: {
                itemsUsed: updatedItems.nModified,
                itemsExpired: expiredItems.length,
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ✅ Get the current state of all items (for mission planning)
exports.getSimulationState = async (req, res) => {
    try {
        const now = new Date();
        const items = await Item.find().sort({ expiryDate: 1 });

        res.json({
            success: true,
            timestamp: now,
            items: items.map(item => ({
                itemId: item.itemId,
                name: item.name,
                remainingUses: item.usageLimit,
                expiryDate: item.expiryDate
            }))
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
