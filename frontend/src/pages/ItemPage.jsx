import { useState } from "react";
import { searchItem, retrieveItem, placeItem } from "@/api/itemApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Navbar from "@/comp/Navbar";
import SpaceScene from "@/comp/SpaceScene";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ItemPage = () => {
  const [itemId, setItemId] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemData, setItemData] = useState(null);
  const [retrievalSteps, setRetrievalSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [retrieved, setRetrieved] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [isWasted, setIsWasted] = useState(false);

  const [containerIdInput, setContainerIdInput] = useState("");
  const [startCoordinates, setStartCoordinates] = useState({ width: "", depth: "", height: "" });
  const [endCoordinates, setEndCoordinates] = useState({ width: "", depth: "", height: "" });

  const [placementMessage, setPlacementMessage] = useState("");
  const [placementSuccess, setPlacementSuccess] = useState(null);

  const handleSearch = async () => {
    if (!itemId && !itemName) {
      toast.error("Please enter an item ID or item name");
      return;
    }

    setLoading(true);
    try {
      const response = await searchItem({ itemId, itemName });
      if (response.found) {
        setItemData(response.item);
        setRetrievalSteps(response.retrievalSteps);
        setRetrieved(false);
        setPlaced(false);
        setIsWasted(false);
        setPlacementMessage("");
        setPlacementSuccess(null);
        toast.success("Item found successfully!");
      } else {
        setItemData(null);
        setRetrievalSteps([]);
        toast.error("Item not found.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to search item");
    }
    setLoading(false);
  };

  const handleRetrieve = async () => {
    if (!itemData) {
      toast.error("Search for an item first");
      return;
    }

    setLoading(true);
    try {
      const response = await retrieveItem({
        itemId: itemData.itemId,
        userId: "user123",
        timestamp: new Date().toISOString(),
      });

      if (response.message.includes("moved to waste")) {
        setIsWasted(true);
        setRetrieved(false);
        setPlaced(false);
        setPlacementMessage("❌ Item moved to waste: no remaining uses.");
        setPlacementSuccess(false);
        toast.error("Item moved to waste");
      } else {
        setIsWasted(false);
        setRetrieved(true);
        setPlaced(false);
        setPlacementMessage("");
        setPlacementSuccess(null);
        toast.success("Item retrieved successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to retrieve item");
    }
    setLoading(false);
  };

  const handlePlace = async () => {
    if (!itemData || !retrieved) {
      setPlacementMessage("❌ Retrieve the item first");
      setPlacementSuccess(false);
      return;
    }

    if (!containerIdInput || !startCoordinates.width || !endCoordinates.width) {
      setPlacementMessage("❌ Please fill all fields before placing.");
      setPlacementSuccess(false);
      return;
    }

    const placementData = {
      itemId: itemData.itemId,
      userId: "user123",
      timestamp: new Date().toISOString(),
      containerId: containerIdInput,
      position: {
        startCoordinates: {
          width: parseFloat(startCoordinates.width),
          depth: parseFloat(startCoordinates.depth),
          height: parseFloat(startCoordinates.height),
        },
        endCoordinates: {
          width: parseFloat(endCoordinates.width),
          depth: parseFloat(endCoordinates.depth),
          height: parseFloat(endCoordinates.height),
        },
      },
    };

    console.log("🛰️ Sending placementData:", placementData);

    setLoading(true);
    try {
      const response = await placeItem(placementData);
      console.log("📥 Place Item Response:", response);

      if (response?.success) {
        setPlacementMessage("✅ Item placed successfully!");
        setPlacementSuccess(true);
        setPlaced(true);
      } else {
        setPlacementMessage(response?.message || "❌ Placement failed without error message.");
        setPlacementSuccess(false);
      }
    } catch (error) {
      console.error("❌ Error placing item:", error);
      setPlacementMessage(error.response?.data?.message || "❌ Failed to place item");
      setPlacementSuccess(false);
    }
    setLoading(false);
  };

  return (
    <div className="p-8 min-h-screen">
      <SpaceScene/>
      <Link
  to="/"
  className="relative z-20 flex items-center justify-end w-full"
>
  <ArrowLeft size={24} sx={{ mr: 1 }} /> 
  Home
</Link>
      <Card className="max-w-2xl mx-auto shadow-lg mt-15">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Item Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Input
              type="text"
              placeholder="Enter Item ID"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Enter Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>
          <Button className="w-full" onClick={handleSearch} disabled={loading}>
            {loading ? "Searching..." : "Search Item"}
          </Button>
        </CardContent>
      </Card>

      {itemData && (
        <Card className="max-w-2xl mx-auto mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Item Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><strong>ID:</strong> {itemData.itemId}</p>
              <p><strong>Name:</strong> {itemData.name}</p>
              <p><strong>Dimensions:</strong> {itemData.width} × {itemData.depth} × {itemData.height}</p>
              <p><strong>Priority:</strong> {itemData.priority}</p>
              <p><strong>Usage Limit:</strong> {itemData.usageLimit}</p>
              <p><strong>Current Uses:</strong> {itemData.currentUses}</p>
              <p><strong>Preferred Zone:</strong> {itemData.preferredZone}</p>
              <p><strong>Container ID:</strong> {itemData.containerId}</p>
              <p><strong>Created At:</strong> {new Date(itemData.createdAt).toLocaleString()}</p>
            </div>
            {isWasted && (
    <p className="mt-4 text-center text-red-600 font-semibold text-md">
      ❌ This item has been moved to waste and cannot be placed.
    </p>
  )}

            {retrievalSteps.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium">Retrieval Steps</h3>
                <ul className="list-disc ml-6 text-sm">
                  {retrievalSteps.map((step) => (
                    <li key={step.step}>{step.action.toUpperCase()} – {step.itemId} ({step.itemName})</li>
                  ))}
                </ul>
              </div>
            )}

            <Button className="w-full mt-4" onClick={handleRetrieve} disabled={loading}>
              Retrieve Item
            </Button>

            {placementMessage && (
              <p className={`mt-2 text-center text-sm font-medium ${placementSuccess ? 'text-green-600' : 'text-red-600'}`}>
                {placementMessage}
              </p>
            )}

            {retrieved && !isWasted && (
              <div className="mt-6">
                <p className="text-green-500 font-medium text-center">✅ Item retrieved. Ready to place.</p>

                <Label className="mt-4">Container ID</Label>
                <Input
                  placeholder="Enter Container ID"
                  value={containerIdInput}
                  onChange={(e) => setContainerIdInput(e.target.value)}
                />

                <h3 className="text-lg font-medium mt-4">Placement Coordinates</h3>
                <div className="grid grid-cols-3 gap-2">
                  <Input placeholder="Start Width" value={startCoordinates.width} onChange={(e) => setStartCoordinates({ ...startCoordinates, width: e.target.value })} />
                  <Input placeholder="Start Depth" value={startCoordinates.depth} onChange={(e) => setStartCoordinates({ ...startCoordinates, depth: e.target.value })} />
                  <Input placeholder="Start Height" value={startCoordinates.height} onChange={(e) => setStartCoordinates({ ...startCoordinates, height: e.target.value })} />
                </div>

                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Input placeholder="End Width" value={endCoordinates.width} onChange={(e) => setEndCoordinates({ ...endCoordinates, width: e.target.value })} />
                  <Input placeholder="End Depth" value={endCoordinates.depth} onChange={(e) => setEndCoordinates({ ...endCoordinates, depth: e.target.value })} />
                  <Input placeholder="End Height" value={endCoordinates.height} onChange={(e) => setEndCoordinates({ ...endCoordinates, height: e.target.value })} />
                </div>

                <Button className="w-full mt-4" onClick={handlePlace} disabled={loading}>
                  Place Item
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ItemPage;
