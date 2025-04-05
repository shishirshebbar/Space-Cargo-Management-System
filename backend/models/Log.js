const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  userId: { type: String, required: true },
  actionType: { 
    type: String, 
    required: true, 
    enum: ["placement", "retrieval", "rearrangement", "disposal", "import", "export", "simulation"]
  },
  itemId: { type: String },
  containerId: { type: String },
  details: {
    fromContainer: { type: String },
    toContainer: { type: String },
    reason: { type: String }
  }
});

module.exports = mongoose.model("Log", LogSchema);
