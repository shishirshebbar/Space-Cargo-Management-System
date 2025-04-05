const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Import Routes
const placementRoutes = require("./routes/placementRoutes");
const itemRoutes = require("./routes/itemRoutes");
const wasteRoutes = require("./routes/wasteRoutes");
const simulationRoutes = require("./routes/simulationRoutes");
const importExportRoutes = require("./routes/importExportRoutes");
const logRoutes = require("./routes/logRoutes");

dotenv.config(); // Load environment variables

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Body parser for JSON requests
app.use(express.urlencoded({ extended: true })); // URL-encoded data

// Debugging: Log all incoming requests
app.use((req, res, next) => {
    console.log(`📢 Incoming request: ${req.method} ${req.path}`);
    next();
});

// API Routes
app.use("/api/placement", placementRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/waste", wasteRoutes);
app.use("/api/simulate", simulationRoutes);
app.use("/api/import", importExportRoutes); // ✅ Ensure this is correct
app.use("/api/logs", logRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
