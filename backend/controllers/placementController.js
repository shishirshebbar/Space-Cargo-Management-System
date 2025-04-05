const Item = require("../models/Item");
const Container = require("../models/Container");

/**
 * Places items in available containers based on priority and space constraints.
 * Items with higher priority are placed first in preferred zones.
 */
exports.placeItems = async (req, res) => {
  try {
    // Fetch all items and containers from the database
    const items = await Item.find({ containerId: null }).sort({ priority: -1 });
    const containers = await Container.find();

    let placements = [];

    // Iterate over each item to find a suitable container
    for (const item of items) {
      let suitableContainer = null;

      // Try to find a container in the preferred zone first
      for (const container of containers) {
        if (container.zone === item.preferredZone) {
          suitableContainer = container;
          break;
        }
      }

      // If no preferred zone container is available, pick any available one
      if (!suitableContainer) {
        suitableContainer = containers.find((c) => !placements.some((p) => p.containerId === c.containerId));
      }

      if (suitableContainer) {
        // Assign item to the container and calculate position
        const position = {
          startCoordinates: { width: 0, depth: 0, height: 0 },
          endCoordinates: {
            width: item.width,
            depth: item.depth,
            height: item.height,
          },
        };

        // Save placement details
        placements.push({
          itemId: item.itemId,
          containerId: suitableContainer.containerId,
          position,
        });

        // Update the item record in the database
        await Item.findByIdAndUpdate(item._id, {
          containerId: suitableContainer.containerId,
          position,
        });
      }
    }

    res.json({ success: true, placements });
  } catch (error) {
    console.error("Placement Error:", error);
    res.status(500).json({ success: false, message: "Failed to place items" });
  }
};