const csv = require("csv-parser");
const fs = require("fs");
const Item = require("../models/Item");
const Container = require("../models/Container");

/**
 * Import items from CSV file with debugging logs
 */
exports.importItems = async (req, res) => {
    if (!req.file) {
        console.error("❌ No file uploaded");
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const importedItems = [];
    const errors = [];
    let rowCount = 0;

    console.log(`📂 Processing CSV file: ${filePath}`);

    fs.createReadStream(filePath)
        .pipe(csv())
        .on("headers", (headers) => {
            console.log("🔍 CSV Headers Detected:", headers);
        })
        .on("data", async (row) => {
            rowCount++;
            try {
                console.log(`📌 Processing Row #${rowCount}:`, row);

                const itemId = row["item_id"]?.trim();
                const name = row["name"]?.trim();
                const width = parseFloat(row["width_cm"]);
                const depth = parseFloat(row["depth_cm"]);
                const height = parseFloat(row["height_cm"]);
                const priority = parseInt(row["priority"]);
                const usageLimit = parseInt(row["usage_limit"]);
                let expiryDate = row["expiry_date"]?.trim();

                if (!itemId || !name) {
                    console.warn(`⚠️ Skipping row ${rowCount}: Missing itemId or name (ID=${itemId})`);
                    return;
                }

                // Handle N/A expiry dates
                if (!expiryDate || expiryDate.toLowerCase() === "n/a") {
                    expiryDate = null; // Store as NULL in DB
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
                console.log(`✅ Saved Item #${rowCount}: ${itemId} - ${name}`);
            } catch (error) {
                console.error(`❌ Error saving item at row ${rowCount}:`, error.message);
                errors.push({ row: rowCount, message: error.message });
            }
        })
        .on("end", () => {
            console.log(`✅ CSV Processing Complete. Total Rows Read: ${rowCount}`);
            console.log(`📊 Summary: Imported: ${importedItems.length}, Errors: ${errors.length}`);
            fs.unlinkSync(filePath);
            return res.json({ success: true, itemsImported: importedItems.length, errors });
        })
        .on("error", (error) => {
            console.error("❌ CSV Parsing Error:", error);
            return res.status(500).json({ success: false, message: "CSV parsing failed" });
        });
};

/**
 * Import containers from CSV file with debugging logs
 */
exports.importContainers = async (req, res) => {
  console.log("📢 Incoming request: POST /api/import/containers");
  console.log("📂 Uploaded File Details:", req.file);

  if (!req.file) {
      console.error("❌ No file uploaded");
      return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const filePath = req.file.path;
  const importedContainers = [];
  const errors = [];
  let rowCount = 0;

  console.log(`📌 Processing CSV file: ${filePath}`);

  fs.createReadStream(filePath)
      .pipe(csv())
      .on("headers", (headers) => {
          console.log("🔍 CSV Headers Detected:", headers);
      })
      .on("data", async (row) => {
          rowCount++;
          console.log(`📌 Processing Row #${rowCount}:`, row);

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
              console.log(`✅ Successfully imported container #${rowCount}: ${containerId}`);
          } catch (error) {
              console.error(`❌ Error saving container at row ${rowCount}:`, error.message);
              errors.push({ row: rowCount, message: error.message });
          }
      })
      .on("end", () => {
          console.log(`✅ CSV Processing Complete. Total Rows Read: ${rowCount}`);
          console.log(`📊 Summary: Imported: ${importedContainers.length}, Errors: ${errors.length}`);

          fs.unlinkSync(filePath); // Cleanup uploaded file
          return res.json({ success: true, containersImported: importedContainers.length, errors });
      })
      .on("error", (error) => {
          console.error("❌ CSV Parsing Error:", error);
          return res.status(500).json({ success: false, message: "CSV parsing failed" });
      });
};