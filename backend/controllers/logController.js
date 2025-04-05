// controllers/logController.js
const Log = require("../models/Log");

exports.getLogs = async (req, res) => {
  try {
    const { startDate, endDate, itemId, userId, actionType } = req.query;

    const filter = {};

    // Add filters if they are present
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    if (itemId) filter.itemId = itemId;
    if (userId) filter.userId = userId;
    if (actionType) filter.actionType = actionType;

    const logs = await Log.find(filter).sort({ timestamp: -1 });

    const formattedLogs = logs.map(log => ({
      timestamp: log.timestamp,
      userId: log.userId,
      actionType: log.actionType,
      itemId: log.itemId,
      details: log.details
    }));

    res.json({ logs: formattedLogs });
  } catch (error) {
    console.error("Fetch Logs Error:", error);
    res.status(500).json({ message: "Failed to retrieve logs" });
  }
};
