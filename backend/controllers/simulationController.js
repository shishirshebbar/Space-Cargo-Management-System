const Item = require("../models/Item");

// Simulate time progression for items in the database.
exports.simulateTime = async (req, res) => {
  try {
    const { numOfDays, toTimestamp, itemsToBeUsedPerDay } = req.body;

    if (!numOfDays && !toTimestamp) {
      return res.status(400).json({ success: false, message: "Either numOfDays or toTimestamp is required." });
    }

    // Fetch items from the database
    const items = await Item.find({ 'itemId': { $in: itemsToBeUsedPerDay.map(item => item.itemId) } });

    const itemsUsed = [];
    const itemsExpired = [];
    const itemsDepletedToday = [];

    // Simulate the usage and expiration of items
    items.forEach(item => {
      const itemInUse = itemsToBeUsedPerDay.find((requestedItem) => requestedItem.itemId === item.itemId);

      if (itemInUse) {
        // If currentUses is 0, treat it as an item usage
        if (item.currentUses === 0) {
          item.currentUses += 1; // Increment the usage to simulate that it's used
          itemsUsed.push({
            itemId: item.itemId,
            name: item.name,
            remainingUses: item.currentUses,
          });
        } else if (item.remainingUses > 0) {
          // Decrease remaining uses if there are remaining uses
          item.remainingUses -= 1;
          itemsUsed.push({
            itemId: item.itemId,
            name: item.name,
            remainingUses: item.remainingUses,
          });
        } else {
          itemsDepletedToday.push({
            itemId: item.itemId,
            name: item.name,
          });
        }

        // If expired
        if (item.expiryDate && new Date(item.expiryDate) < new Date(toTimestamp)) {
          itemsExpired.push({
            itemId: item.itemId,
            name: item.name,
          });
        }
      }

      item.save(); // Save item back with updated values
    });

    // Return the simulated changes and new date
    res.json({
      success: true,
      newDate: toTimestamp,
      changes: {
        itemsUsed,
        itemsExpired,
        itemsDepletedToday,
      },
    });
  } catch (error) {
    console.error("Error simulating time:", error);
    res.status(500).json({ success: false, message: "Error simulating time." });
  }
};
