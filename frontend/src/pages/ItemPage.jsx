import { useState } from "react";
import { searchItem, retrieveItem, placeItem } from "@/api/itemApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Navbar from "@/comp/Navbar";

const ItemPage = () => {
  const [itemId, setItemId] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemData, setItemData] = useState(null);
  const [retrievalSteps, setRetrievalSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [retrieved, setRetrieved] = useState(false);
  const [placed, setPlaced] = useState(false);

  // Placement fields
  const [containerIdInput, setContainerIdInput] = useState("");
  const [startCoordinates, setStartCoordinates] = useState({ width: "", depth: "", height: "" });
  const [endCoordinates, setEndCoordinates] = useState({ width: "", depth: "", height: "" });

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
      await retrieveItem({ itemId: itemData.itemId });
      toast.success("Item retrieved successfully!");
      setRetrieved(true);
      setPlaced(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to retrieve item");
    }
    setLoading(false);
  };

  const handlePlace = async () => {
    if (!itemData || !retrieved) {
      toast.error("Retrieve the item first");
      return;
    }

    if (!containerIdInput || !startCoordinates.width || !endCoordinates.width) {
      toast.error("Please fill all fields before placing.");
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

    setLoading(true);
    try {
      const response = await placeItem(placementData);
      if (response.success) {
        toast.success("Item placed successfully!");
        setPlaced(true);
      } else {
        toast.error("Failed to place item.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place item");
    }
    setLoading(false);
  };

  return (
    <div className="p-8  min-h-screen">
      <Navbar/>
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

            <Button className="w-full mt-4" onClick={handleRetrieve} disabled={loading || retrieved}>
              Retrieve Item
            </Button>

            {retrieved && (
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
