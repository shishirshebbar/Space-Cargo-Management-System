const mongoose = require("mongoose");

const ContainerSchema = new mongoose.Schema({
    containerId: { type: String, required: true, unique: true }, // Unique identifier for the container
    zone: { type: String, required: true }, // The zone where the container is located
    width: { type: Number, required: true }, // Width of the container in cm
    depth: { type: Number, required: true }, // Depth of the container in cm
    height: { type: Number, required: true }, // Height of the container in cm
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }] // Array of items stored in the container
}, { timestamps: true });

module.exports = mongoose.model("Container", ContainerSchema);