const Log = require("../models/log"); // Ensure the import path is correct

exports.getLogs = async (req, res) => {
  try {
    // Get query parameters from the request
    const { startDate, endDate, itemId, userId, actionType } = req.query;

    // Log the incoming query parameters to ensure they're correct
    console.log("Received query parameters:", req.query);

    // Construct the filter object based on provided query parameters
    let filter = {};

    // Handle the date range filtering (startDate and endDate)
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

    // If itemId is provided, add it to the filter
    if (itemId) filter.itemId = itemId.trim();  // Remove any unwanted whitespace like newlines

    // If userId is provided, add it to the filter
    if (userId) filter.userId = userId;

    // If actionType is provided, add it to the filter
    if (actionType) filter.actionType = actionType;

    console.log("Constructed filter:", filter);  // Debugging the filter

    // Fetch logs from the database using the constructed filter
    const logs = await Log.find(filter);

    console.log("Fetched logs:", logs);  // Debugging the logs retrieved

    // If no logs found, respond with an empty array
    if (logs.length === 0) {
      return res.json({
        success: true,
        logs: [],
      });
    }

    // Format and return the logs in the required response format
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
