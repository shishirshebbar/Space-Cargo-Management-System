const Item = require("../models/Item");


exports.simulateTime = async (req, res) => {
  try {
    const { numOfDays, toTimestamp, itemsToBeUsedPerDay } = req.body;

    if (!numOfDays && !toTimestamp) {
      return res.status(400).json({ success: false, message: "Either numOfDays or toTimestamp is required." });
    }

    const items = await Item.find({ 'itemId': { $in: itemsToBeUsedPerDay.map(item => item.itemId) } });

    const itemsUsed = [];
    const itemsExpired = [];
    const itemsDepletedToday = [];

    items.forEach(item => {
      const itemInUse = itemsToBeUsedPerDay.find((requestedItem) => requestedItem.itemId === item.itemId);

      if (itemInUse) {
      
        if (item.currentUses === 0) {
          item.currentUses += 1; 
          itemsUsed.push({
            itemId: item.itemId,
            name: item.name,
            remainingUses: item.currentUses,
          });
        } else if (item.remainingUses > 0) {
        
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

        
        if (item.expiryDate && new Date(item.expiryDate) < new Date(toTimestamp)) {
          itemsExpired.push({
            itemId: item.itemId,
            name: item.name,
          });
        }
      }

      item.save(); 
    });

   
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
