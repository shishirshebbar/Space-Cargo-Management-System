const mongoose = require('mongoose');

const WasteItemSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  name: { type: String, required: true },
  reason: { type: String, enum: ["Expired", "Out of Uses"], required: true },
  containerId: { type: String, required: true },
  position: {
    startCoordinates: {
      width: { type: Number, required: true },
      depth: { type: Number, required: true },
      height: { type: Number, required: true }
    },
    endCoordinates: {
      width: { type: Number, required: true },
      depth: { type: Number, required: true },
      height: { type: Number, required: true }
    }
  }
});

const WasteSchema = new mongoose.Schema({
  wasteItems: { type: [WasteItemSchema], required: true },
  disposalStatus: {
    type: String,
    enum: ["Pending", "Disposed"],
    default: "Pending"
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Waste", WasteSchema);
