import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Header from "../Comp/Header";
import Footer from "../Comp/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const ViewWaste = () => {
  const { token } = useAuth();
  const [wasteItems, setWasteItems] = useState([]);
  const [undockingContainerId, setUndockingContainerId] = useState("");
  const [returnManifest, setReturnManifest] = useState(null);
  const [undockingMessage, setUndockingMessage] = useState(null);
  const [moveWasteMessage, setMoveWasteMessage] = useState(null);
  const fetchWasteItems = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/items/waste`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWasteItems(response.data.wasteItems || []);
    } catch (error) {
      console.error("Failed to fetch waste items", error);
    }
  };

  useEffect(() => {
    if (token) fetchWasteItems();
  }, [token]);

  
  const moveWasteToUndocking = async () => {
    try {
      if (!undockingContainerId) {
        setMoveWasteMessage({ success: false, text: "Please enter a valid container ID." });
        return;
      }
  
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/waste/move-to-undocking`,
        { undockingContainerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // ✅ Set success message
      setMoveWasteMessage({ success: true, text: response.data.message || "Waste moved successfully." });
  
      // Optionally, clear the input field
      setUndockingContainerId("");
  
      // Refresh waste items list
      fetchWasteItems();
    } catch (error) {
      console.error("❌ Failed to move waste", error);
      
      // ❌ Set error message
      setMoveWasteMessage({
        success: false,
        text: error.response?.data?.message || "An error occurred while moving waste.",
      });
    }
  };
  const generateReturnManifest = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/waste/return-manifest`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReturnManifest(response.data.returnManifest);
    } catch (error) {
      console.error("Failed to generate return manifest", error);
    }
  };
  
  const completeUndocking = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/waste/complete-undocking`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // ✅ Set success message
      setUndockingMessage({ success: true, text: response.data.message });
  
      // Refresh waste items list
      fetchWasteItems();
    } catch (error) {
      console.error("Failed to complete waste undocking", error);
  
      // ❌ Set error message
      setUndockingMessage({ success: false, text: error.response?.data?.message || "An error occurred" });
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Waste Management</h2>
          
          {/* Section 1: Current State of Waste Items */}
          <Card className="mb-6">
            <CardContent>
              <CardTitle className="mt-1 mb-3">Current Waste Items</CardTitle>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Usage Limit</TableHead>
                    <TableHead>Expiry Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wasteItems.length > 0 ? (
                    wasteItems.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>{item.itemId}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.usageLimit}</TableCell>
                        <TableCell>{item.expiryDate ? new Date(item.expiryDate).toISOString() : "N/A"}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">No waste items found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="mb-6">
  <CardContent>
    <CardTitle className="mb-5">Move Waste to Undocking</CardTitle>
    <div className="flex items-center gap-4 mt-4">
      <Input
        type="text"
        placeholder="Enter Undocking Container ID"
        value={undockingContainerId}
        onChange={(e) => setUndockingContainerId(e.target.value)}
      />
      <Button onClick={moveWasteToUndocking}>Move Waste</Button>
    </div>

    {moveWasteMessage && (
      <div className={`mt-4 p-2 rounded-lg text-white ${moveWasteMessage.success ? "bg-green-600" : "bg-red-600"}`}>
        {moveWasteMessage.text}
      </div>
    )}
  </CardContent>
</Card>


          {/* Section 3: Generate Waste Return Manifest */}
          <Card className="mb-6">
            <CardContent>
              <CardTitle className="mb-3">Generate Waste Return Manifest</CardTitle>
              <Button onClick={generateReturnManifest}>Generate Manifest</Button>
              {returnManifest && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <h4 className="text-lg font-bold">Manifest Details</h4>
                  <p><strong>Total Weight:</strong> {returnManifest.totalWeight} kg</p>
                  <p><strong>Total Volume:</strong> {returnManifest.totalVolume} cm³</p>
                  <h5 className="font-bold mt-2">Items:</h5>
                  <ul>
                    {returnManifest.returnItems.map((item, index) => (
                      <li key={index}>{item.itemId} - {item.name} ({item.reason})</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mb-6">
  <CardContent>
    <CardTitle className="mb-3">Complete Waste Undocking</CardTitle>
    <Button onClick={completeUndocking} className="bg-red-600 hover:bg-red-700">Complete Undocking</Button>

    {undockingMessage && (
      <div className={`mt-4 p-2 rounded-lg text-white ${undockingMessage.success ? "bg-green-600" : "bg-red-600"}`}>
        {undockingMessage.text}
      </div>
    )}
  </CardContent>
</Card>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ViewWaste;