const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    itemId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    width: { type: Number, required: true, default: 0 },
    depth: { type: Number, required: true, default: 0 },
    height: { type: Number, required: true, default: 0 },
    priority: { type: Number, required: true, default: 1, min: 1 },
    expiryDate: { 
      type: Date, 
      required: false,  
      default: null 
    },
    usageLimit: { type: Number, required: true, default: 1 },
    currentUses: { type: Number, default: 0 },
    preferredZone: { type: String, required: true },
    containerId: { type: String, required: false },
    position: {
        startCoordinates: {
            width: { type: Number, required: false },
            depth: { type: Number, required: false },
            height: { type: Number, required: false },
        },
        endCoordinates: {
            width: { type: Number, required: false },
            depth: { type: Number, required: false },
            height: { type: Number, required: false },
        },
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Item", ItemSchema);
