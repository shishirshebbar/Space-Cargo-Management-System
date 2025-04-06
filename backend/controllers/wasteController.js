const Waste = require("../models/Waste");
const Log = require("../models/Log"); // Assuming you have a Log model for logging actions

/**
 * Identify expired or depleted items as waste.
 */
exports.identifyWaste = async (req, res) => {
  try {
    const wasteDocs = await Waste.find();

    const filteredItems = wasteDocs.flatMap(doc =>
      doc.wasteItems
        .filter(item => ["Expired", "Out of Uses"].includes(item.reason))
        .map(item => {
          // Log the action without userId (optional)
          const logEntry = new Log({
            timestamp: new Date().toISOString(),
            userId: null, // User ID is optional, set as null if not available
            actionType: "Identify Waste",
            itemId: item.itemId,
            details: {
              fromContainer: item.containerId,
              toContainer: null, // Not applicable here as we're only identifying waste
              reason: item.reason
            }
          });

          // Save the log entry
          logEntry.save();

          return {
            itemId: item.itemId,
            name: item.name,
            reason: item.reason,
            containerId: item.containerId,
            position: {
              startCoordinates: {
                width: item.position.startCoordinates.width,
                depth: item.position.startCoordinates.depth,
                height: item.position.startCoordinates.height
              },
              endCoordinates: {
                width: item.position.endCoordinates.width,
                depth: item.position.endCoordinates.depth,
                height: item.position.endCoordinates.height
              }
            }
          };
        })
    );

    res.json({ success: true, wasteItems: filteredItems });
  } catch (error) {
    console.error("Error identifying waste:", error);
    res.status(500).json({ success: false, message: "Failed to identify waste" });
  }
};

exports.generateReturnPlan = async (req, res) => {
  try {
    const { undockingContainerId, undockingDate, maxWeight } = req.body;

    const wasteDocs = await Waste.find();
    const wasteItems = wasteDocs.flatMap(doc => doc.wasteItems);

    let totalVolume = 0;
    let totalWeight = 0;
    const returnItems = [];
    const returnPlan = [];
    const retrievalSteps = [];

    wasteItems.forEach((item, index) => {
      // Simulate item weight and volume
      const volume =
        (item.position.endCoordinates.width - item.position.startCoordinates.width) *
        (item.position.endCoordinates.depth - item.position.startCoordinates.depth) *
        (item.position.endCoordinates.height - item.position.startCoordinates.height);

      const weight = volume * 0.2; // Assume density for mock calculation

      if (totalWeight + weight > maxWeight) return;

      totalVolume += volume;
      totalWeight += weight;

      returnItems.push({
        itemId: item.itemId,
        name: item.name,
        reason: item.reason
      });

      returnPlan.push({
        step: index + 1,
        itemId: item.itemId,
        itemName: item.name,
        fromContainer: item.containerId,
        toContainer: undockingContainerId
      });

      retrievalSteps.push({
        step: index + 1,
        action: "retrieve",
        itemId: item.itemId,
        itemName: item.name
      });

      // Logging the action
      const logEntry = new Log({
        timestamp: new Date().toISOString(), // Current timestamp
        userId: req.user ? req.user.id : "unknown", // If user is logged in, use userId, else "unknown"
        actionType: "Generate Return Plan",
        itemId: item.itemId,
        details: {
          fromContainer: item.containerId,
          toContainer: undockingContainerId,
          reason: item.reason // Log the reason (expired, out of use, etc.)
        }
      });

      // Save log entry to the database
      logEntry.save();
    });

    res.json({
      success: true,
      returnPlan,
      retrievalSteps,
      returnManifest: {
        undockingContainerId,
        undockingDate,
        returnItems,
        totalVolume,
        totalWeight
      }
    });
  } catch (error) {
    console.error("Error generating return plan:", error);
    res.status(500).json({ success: false, message: "Failed to generate return plan" });
  }
};



// const Waste = require("../models/Waste");

// /**
//  * Identify expired or depleted items as waste.
//  */
// exports.identifyWaste = async (req, res) => {
//   try {
//     const wasteDocs = await Waste.find();

//     const filteredItems = wasteDocs.flatMap(doc =>
//       doc.wasteItems
//         .filter(item => ["Expired", "Out of Uses"].includes(item.reason))
//         .map(item => ({
//           itemId: item.itemId,
//           name: item.name,
//           reason: item.reason,
//           containerId: item.containerId,
//           position: {
//             startCoordinates: {
//               width: item.position.startCoordinates.width,
//               depth: item.position.startCoordinates.depth,
//               height: item.position.startCoordinates.height
//             },
//             endCoordinates: {
//               width: item.position.endCoordinates.width,
//               depth: item.position.endCoordinates.depth,
//               height: item.position.endCoordinates.height
//             }
//           }
//         }))
//     );

//     res.json({ success: true, wasteItems: filteredItems });
//   } catch (error) {
//     console.error("Error identifying waste:", error);
//     res.status(500).json({ success: false, message: "Failed to identify waste" });
//   }
// };


/**
 * Generate a return plan for waste disposal.
//  */
// exports.generateReturnPlan = async (req, res) => {
//   try {
//     const { undockingContainerId, undockingDate, maxWeight } = req.body;

//     const wasteDocs = await Waste.find();
//     const wasteItems = wasteDocs.flatMap(doc => doc.wasteItems);

//     let totalVolume = 0;
//     let totalWeight = 0;
//     const returnItems = [];
//     const returnPlan = [];
//     const retrievalSteps = [];

//     wasteItems.forEach((item, index) => {
//       // Simulate item weight and volume
//       const volume =
//         (item.position.endCoordinates.width - item.position.startCoordinates.width) *
//         (item.position.endCoordinates.depth - item.position.startCoordinates.depth) *
//         (item.position.endCoordinates.height - item.position.startCoordinates.height);

//       const weight = volume * 0.2; // Assume density for mock calculation

//       if (totalWeight + weight > maxWeight) return;

//       totalVolume += volume;
//       totalWeight += weight;

//       returnItems.push({
//         itemId: item.itemId,
//         name: item.name,
//         reason: item.reason
//       });

//       returnPlan.push({
//         step: index + 1,
//         itemId: item.itemId,
//         itemName: item.name,
//         fromContainer: item.containerId,
//         toContainer: undockingContainerId
//       });

//       retrievalSteps.push({
//         step: index + 1,
//         action: "retrieve",
//         itemId: item.itemId,
//         itemName: item.name
//       });
//     });

//     res.json({
//       success: true,
//       returnPlan,
//       retrievalSteps,
//       returnManifest: {
//         undockingContainerId,
//         undockingDate,
//         returnItems,
//         totalVolume,
//         totalWeight
//       }
//     });
//   } catch (error) {
//     console.error("Error generating return plan:", error);
//     res.status(500).json({ success: false, message: "Failed to generate return plan" });
//   }
// };

// /**
//  * Complete the waste undocking process.
//  */
// exports.completeUndocking = async (req, res) => {
//   try {
//     const { undockingContainerId, timestamp } = req.body;

//     // Find all waste items matching the given container
//     const wasteDocs = await Waste.find();
//     let itemsRemoved = 0;

//     for (const doc of wasteDocs) {
//       const remainingItems = doc.wasteItems.filter(
//         item => item.containerId !== undockingContainerId
//       );

//       const removedCount = doc.wasteItems.length - remainingItems.length;

//       if (removedCount > 0) {
//         itemsRemoved += removedCount;

//         if (remainingItems.length === 0) {
//           await Waste.deleteOne({ _id: doc._id });
//         } else {
//           doc.wasteItems = remainingItems;
//           await doc.save();
//         }
//       }
//     }

//     res.json({
//       success: true,
//       itemsRemoved
//     });
//   } catch (error) {
//     console.error("Error completing undocking:", error);
//     res.status(500).json({ success: false, itemsRemoved: 0 });
//   }
// };
/**
 * Complete the waste undocking process.
 */
exports.completeUndocking = async (req, res) => {
  try {
    const { undockingContainerId, timestamp } = req.body;

    // Find all waste items matching the given container
    const wasteDocs = await Waste.find();
    let itemsRemoved = 0;

    for (const doc of wasteDocs) {
      const remainingItems = doc.wasteItems.filter(
        item => item.containerId !== undockingContainerId
      );

      const removedCount = doc.wasteItems.length - remainingItems.length;

      if (removedCount > 0) {
        itemsRemoved += removedCount;

        if (remainingItems.length === 0) {
          await Waste.deleteOne({ _id: doc._id });
        } else {
          doc.wasteItems = remainingItems;
          await doc.save();
        }

        // Log the undocking action for each removed item without userId (optional)
        const logEntry = new Log({
          timestamp: new Date().toISOString(),
          userId: null, // User ID is optional, set as null if not available
          actionType: "Complete Undocking",
          itemId: doc.itemId,
          details: {
            fromContainer: undockingContainerId,
            toContainer: null, // No target container specified in undocking
            reason: "Undocking"
          }
        });

        // Save the log entry
        logEntry.save();
      }
    }

    res.json({
      success: true,
      itemsRemoved
    });
  } catch (error) {
    console.error("Error completing undocking:", error);
    res.status(500).json({ success: false, itemsRemoved: 0 });
  }
};
