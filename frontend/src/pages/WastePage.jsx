import { useState } from "react";
import { identifyWaste, generateReturnPlan, completeUndocking } from "@/api/wasteApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/comp/Navbar";
import { Input } from "@/components/ui/input";

const WastePage = () => {
  const [loading, setLoading] = useState(false);
  const [wasteItems, setWasteItems] = useState([]);
  const [undockingContainerId, setUndockingContainerId] = useState("");
  const [undockingDate, setUndockingDate] = useState("");
  const [maxWeight, setMaxWeight] = useState("");
  const [returnPlan, setReturnPlan] = useState(null);
  const [retrievalSteps, setRetrievalSteps] = useState([]);
  const [returnManifest, setReturnManifest] = useState(null);
  const [timestamp, setTimestamp] = useState("");
  const [itemsRemoved, setItemsRemoved] = useState(null);

  // Identifying waste items
  const handleIdentifyWaste = async () => {
    setLoading(true);
    try {
      const { wasteItems } = await identifyWaste();
      setWasteItems(wasteItems);
      toast.success("Waste items identified successfully");
    } catch (error) {
      toast.error("Failed to identify waste items");
    }
    setLoading(false);
  };

  // Generating return plan
  
  const handleGenerateReturnPlan = async () => {
    setLoading(true);
    try {
      const response = await generateReturnPlan({
        undockingContainerId,
        undockingDate,
        maxWeight: parseFloat(maxWeight),
      });

      if (response.success) {
        setReturnPlan(response.returnPlan);
        setRetrievalSteps(response.retrievalSteps);
        setReturnManifest(response.returnManifest);
        toast.success("Return plan generated successfully");
      } else {
        toast.error("Failed to generate return plan");
      }
    } catch (error) {
      toast.error("Error generating return plan");
    }
    setLoading(false);
  };
  const handleCompleteUndocking = async () => {
    setLoading(true);
    try {
      const response = await completeUndocking({
        undockingContainerId,
        timestamp,
      });

      if (response.success) {
        setItemsRemoved(response.itemsRemoved);
        toast.success(`Undocking completed successfully! Items removed: ${response.itemsRemoved}`);
      } else {
        toast.error("Failed to complete undocking");
      }
    } catch (error) {
      toast.error("Error completing undocking");
    }
    setLoading(false);
  };
  return (
    <div className="p-8 min-h-screen">
      <Navbar />
      <Card className="max-w-4xl mx-auto shadow-lg mt-15"> {/* Increased width */}
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Waste Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-10 mb-6">
            <div className="flex flex-row space-x-6 justify-center"> {/* Increased space between buttons */}
              <Button onClick={handleIdentifyWaste} disabled={loading} className="w-1/3">
                {loading ? "Identifying..." : "Identify Waste"}
              </Button>

             
            </div>
          </div>

          {wasteItems.length > 0 && (
            <div className="mt-6 text-gray-900 text-center">
              <h2 className="text-lg font-semibold mb-2">Identified Waste Items:</h2>
              <ul className="list-disc list-inside space-y-1">
                {wasteItems.map(item => (
                  <li key={item.itemId}>
                    <span className="font-medium">{item.name}</span> ({item.reason})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="max-w-4xl mx-auto shadow-lg mt-15">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Waste Return Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <Input
                type="text"
                placeholder="Undocking Container ID"
                value={undockingContainerId}
                onChange={(e) => setUndockingContainerId(e.target.value)}
              />
            </div>
            <div>
              <Input
                type="datetime-local"
                placeholder="Undocking Date"
                value={undockingDate}
                onChange={(e) => setUndockingDate(e.target.value)}
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Max Weight"
                value={maxWeight}
                onChange={(e) => setMaxWeight(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-center">
          <Button
            className="w-1/3  mt-4"
            onClick={handleGenerateReturnPlan}
            disabled={loading}
          >
            {loading ? "Generating Plan..." : "Generate Return Plan"}
          </Button>
          </div>
        </CardContent>
      </Card>

      {returnPlan && (
        <Card className="max-w-4xl mx-auto mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Return Plan Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="text-lg font-medium">Return Plan:</h3>
              <ul className="list-disc ml-6 space-y-2">
                {returnPlan.map((step, index) => (
                  <li key={index}>
                    Step {step.step}: {step.itemName} (ID: {step.itemId}) - Move from {step.fromContainer} to {step.toContainer}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium">Retrieval Steps:</h3>
              <ul className="list-disc ml-6 space-y-2">
                {retrievalSteps.map((step, index) => (
                  <li key={index}>
                    Step {step.step}: {step.action.toUpperCase()} {step.itemName} (ID: {step.itemId})
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium">Return Manifest:</h3>
              {returnManifest ? (
                <div>
                  <p><strong>Undocking Container ID:</strong> {returnManifest.undockingContainerId}</p>
                  <p><strong>Undocking Date:</strong> {returnManifest.undockingDate}</p>
                  <div>
                    <strong>Return Items:</strong>
                    <ul className="list-disc ml-6 space-y-2">
                      {returnManifest.returnItems.map((item, index) => (
                        <li key={index}>
                          Item ID: {item.itemId} - {item.name} (Reason: {item.reason})
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p><strong>Total Volume:</strong> {returnManifest.totalVolume}</p>
                  <p><strong>Total Weight:</strong> {returnManifest.totalWeight}</p>
                </div>
              ) : (
                <p>No return manifest available yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      <Card className="max-w-4xl mx-auto shadow-lg mt-15">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Complete Undocking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-10 mb-6">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="undockingContainerId" className="font-medium">Undocking Container ID</label>
                <input
                  type="text"
                  id="undockingContainerId"
                  className="border p-2 rounded"
                  value={undockingContainerId}
                  onChange={(e) => setUndockingContainerId(e.target.value)}
                  placeholder="Enter Undocking Container ID"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="timestamp" className="font-medium">Timestamp</label>
                <input
                  type="datetime-local"
                  id="timestamp"
                  className="border p-2 rounded"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <Button
                onClick={handleCompleteUndocking}
                disabled={loading}
                
                className="w-1/3"
              >
                {loading ? "Completing..." : "Complete Undocking"}
              </Button>
            </div>

            {itemsRemoved !== null && (
              <div className="mt-4 text-gray-900">
                <h2 className="text-lg font-semibold mb-2">Undocking Summary:</h2>
                <p>Items removed: {itemsRemoved}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WastePage;
