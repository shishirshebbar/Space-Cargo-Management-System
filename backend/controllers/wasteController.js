const Waste = require("../models/Waste");

/**
 * Identify expired or depleted items as waste.
 */
exports.identifyWaste = async (req, res) => {
  try {
    const wasteItems = await Waste.find({ status: "expired" });
    res.json({ success: true, wasteItems });
  } catch (error) {
    console.error("Error identifying waste:", error);
    res.status(500).json({ success: false, message: "Failed to identify waste" });
  }
};

/**
 * Generate a return plan for waste disposal.
 */
exports.generateReturnPlan = async (req, res) => {
  try {
    const { wasteIds } = req.body;
    const wasteItems = await Waste.find({ _id: { $in: wasteIds } });

    const returnPlan = wasteItems.map(item => ({
      id: item._id,
      disposalMethod: item.disposalMethod || "Standard Disposal",
    }));

    res.json({ success: true, returnPlan });
  } catch (error) {
    console.error("Error generating return plan:", error);
    res.status(500).json({ success: false, message: "Failed to generate return plan" });
  }
};

/**
 * Complete the waste undocking process.
 */
exports.completeUndocking = async (req, res) => {
  try {
    const { wasteIds } = req.body;
    await Waste.deleteMany({ _id: { $in: wasteIds } });

    res.json({ success: true, message: "Waste successfully undocked and disposed." });
  } catch (error) {
    console.error("Error completing undocking:", error);
    res.status(500).json({ success: false, message: "Failed to complete undocking" });
  }
};