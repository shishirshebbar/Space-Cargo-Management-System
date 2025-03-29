import { useState, useEffect } from "react";
import Header from "../Comp/Header";
import Footer from "../Comp/Footer";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const ViewWaste = () => {
  const { token } = useAuth();
  const [wasteItems, setWasteItems] = useState([]);
  const [returnManifest, setReturnManifest] = useState([]);

  useEffect(() => {
    fetchWasteState();
  }, [token]);

  const fetchWasteState = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/waste`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWasteItems(response.data);
    } catch (error) {
      console.error("Failed to fetch waste items", error);
    }
  };

  const handleMoveToUndocking = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/waste/move-to-undocking`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchWasteState();
      alert("Waste moved to undocking module!");
    } catch (error) {
      console.error("Failed to move waste", error);
    }
  };

  const handleGenerateManifest = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/waste/generate-manifest`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReturnManifest(response.data);
      alert("Waste return manifest generated!");
    } catch (error) {
      console.error("Failed to generate manifest", error);
    }
  };

  const handleCompleteUndocking = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/waste/complete-undocking`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchWasteState();
      alert("Waste undocking completed!");
    } catch (error) {
      console.error("Failed to complete undocking", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Waste Management</h2>

          {/* Current Waste State */}
          <Card className="mb-6">
            <CardContent>
              <CardTitle>Current Waste Items</CardTitle>
              <Table className="mt-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>Item ID</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wasteItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Move Waste to Undocking */}
          <Card className="mb-6">
            <CardContent>
              <CardTitle>Move Waste to Undocking Module</CardTitle>
              <Button onClick={handleMoveToUndocking}>Move Waste</Button>
            </CardContent>
          </Card>

          {/* Generate Waste Return Manifest */}
          <Card className="mb-6">
            <CardContent>
              <CardTitle>Generate Waste Return Manifest</CardTitle>
              <Button onClick={handleGenerateManifest}>Generate Manifest</Button>
              {returnManifest.length > 0 && (
                <Table className="mt-4">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item ID</TableHead>
                      <TableHead>Return Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {returnManifest.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Complete Waste Undocking */}
          <Card className="mb-6">
            <CardContent>
              <CardTitle>Complete Waste Undocking</CardTitle>
              <Button onClick={handleCompleteUndocking}>Complete Undocking</Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ViewWaste;