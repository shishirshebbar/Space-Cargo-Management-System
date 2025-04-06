const Item = require("../models/Item");
exports.placeItems = async (req, res) => {
  try {
    const { items = [], containers = [] } = req.body;

    if (!items.length || !containers.length) {
      return res.status(400).json({
        success: false,
        message: "Items and containers are required in the request body",
      });
    }

    items.sort((a, b) => b.priority - a.priority);

    const placements = [];
    const rearrangements = [];
    let step = 1;

    const fitsInContainer = (item, container) => {
      return (
        item.width <= container.width &&
        item.depth <= container.depth &&
        item.height <= container.height
      );
    };

    for (const item of items) {
      let selectedContainer = null;

      const preferredContainers = containers.filter(
        (c) => c.zone === item.preferredZone && fitsInContainer(item, c)
      );

      if (preferredContainers.length) {
        selectedContainer = preferredContainers[0];
      } else {
        selectedContainer = containers.find((c) => fitsInContainer(item, c));
      }

      if (selectedContainer) {
        const containerId = selectedContainer.containerId;

        const position = {
          startCoordinates: { width: 0, depth: 0, height: 0 },
          endCoordinates: {
            width: item.width,
            depth: item.depth,
            height: item.height,
          },
        };

   
        await Item.findOneAndUpdate(
          { itemId: item.itemId },
          {
            containerId,
            zone: selectedContainer.zone,
            position,
          },
          { new: true }
        );

        placements.push({
          itemId: item.itemId,
          containerId,
          position,
        });

        rearrangements.push({
          step: step++,
          action: "place",
          itemId: item.itemId,
          fromContainer: null,
          fromPosition: null,
          toContainer: containerId,
          toPosition: position,
        });
      }
    }

    res.json({ success: true, placements, rearrangements });
  } catch (error) {
    console.error("Placement error:", error);
    res.status(500).json({ success: false, message: "Failed to place items" });
  }
};
