import { useState } from "react";
import { simulateTime, getCurrentState } from "@/api/simulationApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navbar from "@/comp/Navbar";

const SimulationPage = () => {
  const [days, setDays] = useState("");
  const [items, setItems] = useState([]);
  const [loadingSim, setLoadingSim] = useState(false);
  const [loadingState, setLoadingState] = useState(false);

  const handleSimulate = async () => {
    if (!days || isNaN(days) || days <= 0) {
      toast.error("Enter a valid number of days");
      return;
    }

    setLoadingSim(true);
    try {
      const res = await simulateTime(Number(days));
      if (res.success) {
        toast.success(res.message);
        setItems(res.updatedItems);
      }
    } catch (error) {
      toast.error("Simulation failed");
    }
    setLoadingSim(false);
  };

  const handleGetState = async () => {
    setLoadingState(true);
    try {
      const res = await getCurrentState();
      if (res.success) {
        setItems(res.items);
        toast.success("Current state fetched");
      }
    } catch (error) {
      toast.error("Failed to fetch current state");
    }
    setLoadingState(false);
  };

  return (
    <div className="p-8  min-h-screen">
      <Navbar/>      <div className="mt-30 ml-70 w-full max-w-3xl bg-gray-800 p-4 rounded-lg shadow-lg border border-white-700">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Item Simulation & State</h1>

        {/* Simulate Time Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-300">Simulate Time</h2>
          <div className="flex items-center gap-4 mt-2">
            <Input
              type="number"
              placeholder="Enter number of days"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="bg-gray-700 text-white border-gray-600 focus:border-yellow-500 w-64"
            />
            <Button
              onClick={handleSimulate}
              disabled={loadingSim}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
            >
              {loadingSim ? "Simulating..." : "Simulate"}
            </Button>
          </div>
        </div>

        {/* Get Current State Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-300">Current Item State</h2>
          <Button 
            onClick={handleGetState} 
            disabled={loadingState}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold mt-3"
          >
            {loadingState ? "Fetching..." : "Get Current State"}
          </Button>
        </div>

        {/* Item Cards */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <div key={item._id} className="p-4 border rounded-lg bg-gray-700 text-white shadow-md">
                <p className="font-bold text-yellow-400">ID: {item.itemId}</p>
                <p><strong>Name:</strong> {item.name}</p>
                <p><strong>Dimensions:</strong> {item.width} × {item.depth} × {item.height}</p>
                <p><strong>Priority:</strong> {item.priority}</p>
                <p><strong>Usage Limit:</strong> {item.usageLimit}</p>
                <p><strong>Current Uses:</strong> {item.currentUses}</p>
                <p><strong>Preferred Zone:</strong> {item.preferredZone}</p>
                <p><strong>Container ID:</strong> {item.containerId}</p>
                <p><strong>Created At:</strong> {new Date(item.createdAt).toLocaleString()}</p>
                {item.expiryDate && (
                  <p><strong>Expiry:</strong> {new Date(item.expiryDate).toLocaleDateString()}</p>
                )}
                {item.remainingDays !== undefined && (
                  <p><strong>Remaining Days:</strong> {item.remainingDays}</p>
                )}
                {item.status && (
                  <p><strong>Status:</strong> {item.status}</p>
                )}
                {item.position && (
                  <div className="mt-2">
                    <p className="font-semibold">Start Coordinates:</p>
                    <p>Width: {item.position.startCoordinates.width}</p>
                    <p>Depth: {item.position.startCoordinates.depth}</p>
                    <p>Height: {item.position.startCoordinates.height}</p>
                    <p className="font-semibold mt-1">End Coordinates:</p>
                    <p>Width: {item.position.endCoordinates.width}</p>
                    <p>Depth: {item.position.endCoordinates.depth}</p>
                    <p>Height: {item.position.endCoordinates.height}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationPage;
