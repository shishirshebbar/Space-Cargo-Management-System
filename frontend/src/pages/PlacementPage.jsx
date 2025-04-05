import { useState } from "react";
import { placeItems } from "@/api/placementApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; 
import { toast } from "sonner";
import Navbar from "@/comp/Navbar";

const PlacementPage = () => {
  const [itemId, setItemId] = useState("");
  const [containerId, setContainerId] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePlaceItem = async () => {
    if (!itemId || !containerId) {
      toast.error("Please enter both Item ID and Container ID");
      return;
    }

    setLoading(true);
    try {
      await placeItems({ itemId, containerId });
      toast.success(`Item ${itemId} placed in Container ${containerId} successfully!`);
      setItemId("");
      setContainerId("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place item");
    }
    setLoading(false);
  };

  return (
    <div className="p-8  min-h-screen">     <Navbar/>
      <div className="mt-30 ml-120 w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg border border-white-700">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Item Placement</h1>

        <div className="flex flex-col gap-4">
          <Input 
            type="text" 
            placeholder="Enter Item ID" 
            value={itemId} 
            onChange={(e) => setItemId(e.target.value)}
            className="bg-gray-700 text-white border-gray-600 focus:border-blue-500"
          />
          <Input 
            type="text" 
            placeholder="Enter Container ID" 
            value={containerId} 
            onChange={(e) => setContainerId(e.target.value)}
            className="bg-gray-700 text-white border-gray-600 focus:border-blue-500"
          />
          <Button 
            onClick={handlePlaceItem} 
            disabled={loading} 
            className="w-full"
          >
            {loading ? "Placing..." : "Place Item"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlacementPage;