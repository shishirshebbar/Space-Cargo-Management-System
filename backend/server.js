const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const itemRoutes = require("./routes/itemRoutes");
const containerRoutes = require("./routes/containerRoutes");
const wasteRoutes = require("./routes/wasteRoutes");
const simulationRoutes = require("./routes/simulationRoutes");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/items", itemRoutes);
app.use("/api/containers", containerRoutes);
app.use("/api/waste", wasteRoutes);
app.use("/api/simulation", simulationRoutes);
app.use("/api/users", userRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));