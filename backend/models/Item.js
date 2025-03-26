const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    itemId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    width: { type: Number, required: true },
    depth: { type: Number, required: true },
    height: { type: Number, required: true },
    mass: { type: Number, required: true },
    priority: { type: Number, required: true, min: 1, max: 100 }, // Priority from 1 to 100
    expiryDate: { type: Date, default: null }, // Optional expiry date
    usageLimit: { type: Number, required: true }, // Number of times an item can be used before disposal
    preferredZone: { type: String, required: true }, // Suggested storage zone
    containerId: { type: mongoose.Schema.Types.ObjectId, ref: "Container", default: null } // Reference to Container
}, { timestamps: true });

module.exports = mongoose.model("Item", ItemSchema);