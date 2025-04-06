import { useState } from "react";
import { simulateTime } from "@/api/simulationApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/comp/Navbar";

const SimulationPage = () => {
  const [days, setDays] = useState(""); // Number of days to simulate
  const [timestamp, setTimestamp] = useState(""); // Optional timestamp for simulation end
  const [items, setItems] = useState([]); // Simulated items used
  const [expiredItems, setExpiredItems] = useState([]); // Items that expired
  const [depletedItems, setDepletedItems] = useState([]); // Items that are out of uses
  const [loadingSim, setLoadingSim] = useState(false);
  const [itemId, setItemId] = useState(""); // Item ID input
  const [itemName, setItemName] = useState(""); // Item Name input
  const [itemsToBeUsed, setItemsToBeUsed] = useState([]); // List of items to be used
  const [newDate, setNewDate] = useState(""); // New date after simulation

  // Handle Simulating Time
  const handleSimulate = async () => {
    if (!days && !timestamp) {
      toast.error("Enter either a valid number of days or a timestamp");
      return;
    }

    // Prepare the body for the request
    const requestBody = {
      numOfDays: Number(days), // or use 'toTimestamp' if provided
      toTimestamp: timestamp,
      itemsToBeUsedPerDay: itemsToBeUsed,
    };

    setLoadingSim(true);
    try {
      const res = await simulateTime(requestBody);

      if (res.success) {
        toast.success("Simulation successful");

        // Extract the full response and display
        setNewDate(res.newDate); // Set the new date after simulation
        setItems(res.changes.itemsUsed); // Display items used after simulation
        setExpiredItems(res.changes.itemsExpired); // Display expired items
        setDepletedItems(res.changes.itemsDepletedToday); // Display depleted items
      } else {
        toast.error("Simulation failed");
      }
    } catch (error) {
      toast.error("Simulation failed");
    }
    setLoadingSim(false);
  };

  // Add item to the list of items to be used
  const handleAddItem = () => {
    if (!itemId || !itemName) {
      toast.error("Please provide both Item ID and Item Name");
      return;
    }

    setItemsToBeUsed([
      ...itemsToBeUsed,
      { itemId, name: itemName }
    ]);
    setItemId(""); // Clear input fields
    setItemName(""); // Clear input fields
  };

  return (
    <div className="p-8 min-h-screen">
      <Navbar />
      <Card className="max-w-3xl mx-auto mt-15">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Item Simulation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-black-300">Simulate Time</h2>
            <div className="flex items-center gap-4 mt-2">
              <Input
                type="number"
                placeholder="Enter number of days"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className=" text-gray border-gray-600 focus:border-yellow-500 w-64"
              />
              <Input
                type="datetime-local"
                placeholder="or select timestamp"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                className=" text-gray border-gray-600 focus:border-yellow-500 w-64"
              />
              <Button
                onClick={handleSimulate}
                disabled={loadingSim}
                className="hover:bg-yellow-600 text-white font-semibold"
              >
                {loadingSim ? "Simulating..." : "Simulate"}
              </Button>
            </div>
          </div>

          {/* Add Items to Use Per Day */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-black-300">Items to be Used Per Day</h2>
            <div className="flex gap-4 mt-2">
              <Input
                type="text"
                placeholder="Item ID"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
                className="text-gray border-gray-600 focus:border-yellow-500 w-64"
              />
              <Input
                type="text"
                placeholder="Item Name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="text-gray border-gray-600 focus:border-yellow-500 w-64"
              />
              <Button
                onClick={handleAddItem}
                className=" hover:bg-yellow-600 text-white font-semibold"
              >
                Add Item
              </Button>
            </div>

            {/* Display added items */}
            {itemsToBeUsed.length > 0 && (
              <div className="mt-4">
                <h3 className="text-black-300">Items to be Used:</h3>
                <ul className="list-disc pl-6 text-black-200">
                  {itemsToBeUsed.map((item, index) => (
                    <li key={index}>
                      {item.itemId} - {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Simulated Items State */}
          {newDate && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-300">New Simulation Date:</h2>
              <p>{new Date(newDate).toLocaleString()}</p>
            </div>
          )}

          {items.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-300">Simulated Items Used:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item) => (
                  <Card key={item.itemId} className="bg-gray-700 text-white shadow-md">
                    <CardHeader>
                      <CardTitle className="font-semibold text-yellow-400">{item.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p><strong>Item ID:</strong> {item.itemId}</p>
                      <p><strong>Remaining Uses:</strong> {item.remainingUses}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
          )}

          {/* Expired Items */}
          {expiredItems.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-300">Expired Items:</h2>
              <ul className="list-disc pl-6 text-black-200">
                {expiredItems.map((item) => (
                  <li key={item.itemId}>
                    {item.itemId} - {item.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Depleted Items */}
          {depletedItems.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-300">Depleted Items (Out of Uses):</h2>
              <ul className="list-disc pl-6 text-black-200">
                {depletedItems.map((item) => (
                  <li key={item.itemId}>
                    {item.itemId} - {item.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SimulationPage;
