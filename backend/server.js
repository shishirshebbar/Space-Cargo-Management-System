const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");



const placementRoutes = require("./routes/placementRoutes");
const itemRoutes = require("./routes/itemRoutes");
const wasteRoutes = require("./routes/wasteRoutes");
const simulationRoutes = require("./routes/simulationRoutes");
const importExportRoutes = require("./routes/importExportRoutes");
const logRoutes = require("./routes/logRoutes");
const exportRoutes = require("./routes/exportRoutes");

dotenv.config(); 


connectDB();

const app = express();


app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
    console.log(` Incoming request: ${req.method} ${req.path}`);
    next();
});


app.use("/api/placement", placementRoutes);
app.use("/api/", itemRoutes);
app.use("/api/waste", wasteRoutes);
app.use("/api/simulate", simulationRoutes);
app.use("/api/import", importExportRoutes); 
app.use("/api/logs", logRoutes);
app.use("/api/export",exportRoutes)



const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
