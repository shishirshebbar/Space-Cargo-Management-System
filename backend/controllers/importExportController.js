const csv = require("csv-parser");
const fs = require("fs");
const Item = require("../models/Item");
const Container = require("../models/Container");
const { Parser } = require("json2csv");

const { Readable } = require("stream");



//import imtems from csv
exports.importItems = async (req, res) => {
    if (!req.file) {
        console.error(" No file uploaded");
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const importedItems = [];
    const errors = [];
    const savePromises = [];
    let rowCount = 0;

    console.log(` Processing CSV file: ${filePath}`);

    fs.createReadStream(filePath)
        .pipe(csv())
        .on("headers", (headers) => {
            console.log(" CSV Headers Detected:", headers);
        })
        .on("data", (row) => {
            rowCount++;

            const processRow = async () => {
                try {
                    console.log(` Processing Row #${rowCount}:`, row);

                    const itemId = row["item_id"]?.trim();
                    const name = row["name"]?.trim();
                    const width = parseFloat(row["width_cm"]);
                    const depth = parseFloat(row["depth_cm"]);
                    const height = parseFloat(row["height_cm"]);
                    const priority = parseInt(row["priority"]);
                    const usageLimit = parseInt(row["usage_limit"]);
                    let expiryDate = row["expiry_date"]?.trim();

                    if (!itemId || !name) {
                        console.warn(`Skipping row ${rowCount}: Missing itemId or name (ID=${itemId})`);
                        return;
                    }

                    
                    if (!expiryDate || expiryDate.toLowerCase() === "n/a") {
                        expiryDate = null;
                    } else {
                        const parsedDate = new Date(expiryDate);
                        expiryDate = isNaN(parsedDate.getTime()) ? null : parsedDate;
                    }

                    const newItem = new Item({
                        itemId,
                        name,
                        width: isNaN(width) ? 0 : width,
                        depth: isNaN(depth) ? 0 : depth,
                        height: isNaN(height) ? 0 : height,
                        priority: isNaN(priority) ? 1 : priority,
                        expiryDate,
                        usageLimit: isNaN(usageLimit) ? 1 : usageLimit,
                        preferredZone: row["preferred_zone"]?.trim() || null,
                    });

                    await newItem.save();
                    importedItems.push(newItem);
                    console.log(`Saved Item #${rowCount}: ${itemId} - ${name}`);
                } catch (error) {
                    console.error(`Error saving item at row ${rowCount}:`, error.message);
                    errors.push({ row: rowCount, message: error.message });
                }
            };

            savePromises.push(processRow());
        })
        .on("end", async () => {
            try {
                await Promise.all(savePromises); 
                console.log(`CSV Processing Complete. Total Rows Read: ${rowCount}`);
                console.log(` Summary: Imported: ${importedItems.length}, Errors: ${errors.length}`);

                fs.unlinkSync(filePath);

                return res.json({
                    success: true,
                    itemsImported: importedItems.length,
                    errors,
                });
            } catch (finalError) {
                console.error("Unexpected error during finalization:", finalError);
                return res.status(500).json({ success: false, message: "Unexpected error during import." });
            }
        })
        .on("error", (error) => {
            console.error(" CSV Parsing Error:", error);
            return res.status(500).json({ success: false, message: "CSV parsing failed" });
        });
};

//import containers from csv
exports.importContainers = async (req, res) => {
    console.log("Incoming request: POST /api/import/containers");
    console.log(" Uploaded File Details:", req.file);

    if (!req.file) {
        console.error(" No file uploaded");
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const importedContainers = [];
    const errors = [];
    const savePromises = [];
    let rowCount = 0;

    console.log(`Processing CSV file: ${filePath}`);

    fs.createReadStream(filePath)
        .pipe(csv())
        .on("headers", (headers) => {
            console.log("🔍 CSV Headers Detected:", headers);
        })
        .on("data", (row) => {
            rowCount++;

            const processRow = async () => {
                console.log(` Processing Row #${rowCount}:`, row);

                try {
                    const containerId = row["container_id"]?.trim();
                    const zone = row["zone"]?.trim();
                    const width = parseFloat(row["width_cm"]);
                    const depth = parseFloat(row["depth_cm"]);
                    const height = parseFloat(row["height_cm"]);

                    if (!containerId || !zone) {
                        console.warn(`⚠️ Skipping row ${rowCount}: Missing containerId or zone`);
                        return;
                    }

                    const newContainer = new Container({
                        containerId,
                        zone,
                        width: isNaN(width) ? 0 : width,
                        depth: isNaN(depth) ? 0 : depth,
                        height: isNaN(height) ? 0 : height,
                    });

                    await newContainer.save();
                    importedContainers.push(newContainer);
                    console.log(` Successfully imported container #${rowCount}: ${containerId}`);
                } catch (error) {
                    console.error(` Error saving container at row ${rowCount}:`, error.message);
                    errors.push({ row: rowCount, message: error.message });
                }
            };

            savePromises.push(processRow());
        })
        .on("end", async () => {
            try {
                await Promise.all(savePromises); 
                console.log(` CSV Processing Complete. Total Rows Read: ${rowCount}`);
                console.log(` Summary: Imported: ${importedContainers.length}, Errors: ${errors.length}`);

                fs.unlinkSync(filePath); 

                return res.json({
                    success: true,
                    containersImported: importedContainers.length,
                    errors,
                });
            } catch (finalError) {
                console.error(" Unexpected error during finalization:", finalError);
                return res.status(500).json({ success: false, message: "Unexpected error during import." });
            }
        })
        .on("error", (error) => {
            console.error(" CSV Parsing Error:", error);
            return res.status(500).json({ success: false, message: "CSV parsing failed" });
        });
};






//export csv file
exports.exportArrangement = async (req, res) => {
    try {
      console.log("Fetching arranged items from DB...");
  
      const arrangedItems = await Item.find({
        containerId: { $ne: null },
        "position.startCoordinates": { $ne: null },
        "position.endCoordinates": { $ne: null }
      });
  
      if (arrangedItems.length === 0) {
        console.warn("No arranged items found");
        return res.status(404).send("No arranged items found.");
      }
  
      console.log(`Found ${arrangedItems.length} arranged items`);
  
      const formattedData = arrangedItems.map(item => ({
        "Item ID": item.itemId,
        "Container ID": item.containerId,
        "Coordinates (W1,D1,H1),(W2,D2,H2)": `(${item.position.startCoordinates.width},${item.position.startCoordinates.depth},${item.position.startCoordinates.height}),(${item.position.endCoordinates.width},${item.position.endCoordinates.depth},${item.position.endCoordinates.height})`
      }));
  
      const csv = new Parser({ fields: ["Item ID", "Container ID", "Coordinates (W1,D1,H1),(W2,D2,H2)"] }).parse(formattedData);
  
      res.header("Content-Type", "text/csv");
      res.attachment("arranged_items.csv");
  
      console.log("Sending CSV file to client");
      return res.send(csv);
    } catch (error) {
      console.error("Error exporting arrangement:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };