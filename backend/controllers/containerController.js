const Container = require("../models/Container");
const Item = require("../models/Item");

// ✅ Add a new container
exports.addContainer = async (req, res) => {
    try {
        const { containerId, zone, width, depth, height } = req.body;

        // Check if container already exists
        const existingContainer = await Container.findOne({ containerId });
        if (existingContainer) {
            return res.status(400).json({ success: false, message: "Container ID already exists" });
        }

        const newContainer = new Container({
            containerId,
            zone,
            width,
            depth,
            height,
            items: []
        });

        await newContainer.save();
        res.status(201).json({ success: true, message: "Container added successfully", container: newContainer });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ✅ Get all containers
exports.getContainers = async (req, res) => {
    try {
        const containers = await Container.find().populate("items");
        res.json({ success: true, containers });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ✅ Get a single container by ID
exports.getContainerById = async (req, res) => {
    try {
        const { containerId } = req.params;
        const container = await Container.findOne({ containerId }).populate("items");

        if (!container) {
            return res.status(404).json({ success: false, message: "Container not found" });
        }

        res.json({ success: true, container });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ✅ Move an item from one container to another
exports.moveItem = async (req, res) => {
    try {
        const { itemId, fromContainerId, toContainerId } = req.body;

        const fromContainer = await Container.findOne({ containerId: fromContainerId });
        const toContainer = await Container.findOne({ containerId: toContainerId });
        const item = await Item.findOne({ itemId });

        if (!fromContainer || !toContainer) {
            return res.status(404).json({ success: false, message: "One or both containers not found" });
        }

        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        // Remove item from current container
        fromContainer.items = fromContainer.items.filter((id) => id.toString() !== item._id.toString());
        await fromContainer.save();

        // Add item to the new container
        item.containerId = toContainer._id;
        await item.save();

        toContainer.items.push(item._id);
        await toContainer.save();

        res.json({ success: true, message: "Item moved successfully" });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ✅ Delete a container (only if empty)
exports.deleteContainer = async (req, res) => {
    try {
        const { containerId } = req.params;

        const container = await Container.findOne({ containerId });
        if (!container) {
            return res.status(404).json({ success: false, message: "Container not found" });
        }

        if (container.items.length > 0) {
            return res.status(400).json({ success: false, message: "Container is not empty" });
        }

        await Container.deleteOne({ containerId });
        res.json({ success: true, message: "Container deleted successfully" });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};