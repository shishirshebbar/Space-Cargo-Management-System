const express = require("express");
const {
    addContainer,
    getContainers,
    getContainerById,
    moveItem,
    deleteContainer
} = require("../controllers/containerController");

const router = express.Router();

// ✅ Add a new container
router.post("/add", addContainer);

// ✅ Get all containers
router.get("/", getContainers);

// ✅ Get a specific container by ID
router.get("/:containerId", getContainerById);

// ✅ Move an item from one container to another
router.post("/move", moveItem);

// ✅ Delete a container (only if empty)
router.delete("/:containerId", deleteContainer);

module.exports = router;