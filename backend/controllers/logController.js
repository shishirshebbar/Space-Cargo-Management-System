const Log = require("../models/log"); 
exports.getLogs = async (req, res) => {
  try {
   
    const { startDate, endDate, itemId, userId, actionType } = req.query;

       console.log("Received query parameters:", req.query);

       let filter = {};

        if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      
      if (start.toString() === 'Invalid Date' || end.toString() === 'Invalid Date') {
        return res.status(400).json({ success: false, message: 'Invalid date format' });
      }

      filter.timestamp = {
        $gte: start,
        $lte: end,
      };
    }

        if (itemId) filter.itemId = itemId.trim();  
    if (userId) filter.userId = userId;

   
    if (actionType) filter.actionType = actionType;

    console.log("Constructed filter:", filter); 

   
    const logs = await Log.find(filter);

    console.log("Fetched logs:", logs);  
    if (logs.length === 0) {
      return res.json({
        success: true,
        logs: [],
      });
    }

    
    res.json({
      success: true,
      logs: logs.map(log => ({
        timestamp: log.timestamp,
        userId: log.userId,
        actionType: log.actionType,
        itemId: log.itemId,
        details: log.details,
      })),
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ success: false, message: 'Failed to fetch logs', error: error.message });
  }
};