const mongoose = require('mongoose');

const WasteSchema = new mongoose.Schema({
    itemId: { type: String, required: true },
    name: { type: String, required: true },
    reason: { type: String, enum: ["Expired", "Out of Uses"], required: true }, // Why it's waste
    containerId: { type: String, required: true }, // Where the waste is stored
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
    },
    disposalStatus: { type: String, enum: ["Pending", "Disposed"], default: "Pending" }, // Status of waste disposal
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Waste', WasteSchema);