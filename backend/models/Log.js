const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  timestamp: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: false,
    default: null 
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
      required: false, 
      default: null
    },
    reason: {
      type: String,
      required: true
    }
  }
});


const Log = mongoose.models.Log || mongoose.model("Log", logSchema);

module.exports = Log;
