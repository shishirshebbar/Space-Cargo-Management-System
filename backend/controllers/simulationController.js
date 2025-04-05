const Item = require("../models/Item");

/**
 * Simulate time passage for all stored items.
 * Updates expiration and usage status based on time progression.
 */
exports.simulateTime = async (req, res) => {
  try {
    const { days } = req.body;

    if (!days || days <= 0) {
      return res.status(400).json({ success: false, message: "Invalid time duration" });
    }

    const items = await Item.find();

    const updatedItems = await Promise.all(
      items.map(async (item) => {
        let newRemainingDays = item.remainingDays - days;

        if (newRemainingDays <= 0) {
          item.status = "Expired/Used";
          newRemainingDays = 0;
        }

        item.remainingDays = newRemainingDays;
        await item.save();
        return item;
      })
    );

    res.json({ success: true, message: `Simulated ${days} days`, updatedItems });
  } catch (error) {
    console.error("Time Simulation Error:", error);
    res.status(500).json({ success: false, message: "Failed to simulate time" });
  }
};

/**
 * Get the current state of all items, including expiration status.
 */
exports.getCurrentState = async (req, res) => {
  try {
    const items = await Item.find();
    res.json({ success: true, items });
  } catch (error) {
    console.error("State Retrieval Error:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve item states" });
  }
};
