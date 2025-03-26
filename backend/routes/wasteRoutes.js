const express = require("express");
const {
    identifyWaste,
    moveWasteToUndocking,
    generateReturnManifest,
    completeUndocking
} = require("../controllers/wasteController");

const router = express.Router();

// ✅ Identify expired or fully used items
router.get("/identify", identifyWaste);

// ✅ Move waste items to the undocking module
router.post("/move-to-undocking", moveWasteToUndocking);

// ✅ Generate waste return manifest
router.get("/return-manifest", generateReturnManifest);

// ✅ Complete waste undocking (delete waste items)
router.post("/complete-undocking", completeUndocking);

module.exports = router;