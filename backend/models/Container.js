const mongoose = require("mongoose");

const ContainerSchema = new mongoose.Schema({
  containerId: { type: String, required: true, unique: true },
  zone: { type: String, required: true },
  width: { type: Number, required: true },
  depth: { type: Number, required: true },
  height: { type: Number, required: true },
  items: [
    {
      itemId: { type: String, required: true },
      startCoordinates: {
        width: { type: Number, required: true },
        depth: { type: Number, required: true },
        height: { type: Number, required: true },
      },
      endCoordinates: {
        width: { type: Number, required: true },
        depth: { type: Number, required: true },
        height: { type: Number, required: true },
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Container", ContainerSchema);
