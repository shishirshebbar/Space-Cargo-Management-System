const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  timestamp: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: false, // Make userId optional
    default: null // Default to null if not provided
  },
  actionType: {
    type: String,
    required: true
  },
  itemId: {
    type: String,
    required: true
  },
  details: {
    fromContainer: {
      type: String,
      required: true
    },
    toContainer: {
      type: String,
      required: false, // Not always required
      default: null
    },
    reason: {
      type: String,
      required: true
    }
  }
});

// Check if the model is already compiled to avoid overwriting
const Log = mongoose.models.Log || mongoose.model("Log", logSchema);

module.exports = Log;
