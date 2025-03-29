import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import Header from "../Comp/Header";
import Footer from "../Comp/Footer";

const ViewContainers = () => {
  const { token } = useAuth();
  const [containers, setContainers] = useState([]);
  const [containerId, setContainerId] = useState("");
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [moveItemData, setMoveItemData] = useState({ itemId: "", fromContainerId: "", toContainerId: "" });

  // Fetch all containers
  const fetchContainers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/containers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContainers(response.data.containers || []);
    } catch (error) {
      console.error("Failed to fetch containers", error);
    }
  };

  useEffect(() => {
    if (token) fetchContainers();
  }, [token]);

  // Fetch container by ID
  const fetchContainerById = async () => {
    if (!containerId) return;
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/containers/${containerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedContainer(response.data.container);
    } catch (error) {
      console.error("Container not found", error);
      setSelectedContainer(null);
    }
  };

  // Move item between containers
  const handleMoveItem = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/containers/move`, moveItemData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Item moved successfully!");
      setMoveItemData({ itemId: "", fromContainerId: "", toContainerId: "" });
      fetchContainers(); // Refresh list
    } catch (error) {
      console.error("Failed to move item", error);
    }
  };

  // Delete a container
  const handleDeleteContainer = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this container?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/containers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Container deleted successfully!");
      fetchContainers(); // Refresh list
    } catch (error) {
      console.error("Failed to delete container", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Containers</h2>

          {/* Fetch Container by ID */}
          <Card className="mb-6">
            <CardContent>
              <CardTitle>Fetch Container by ID</CardTitle>
              <div className="flex gap-4">
                <Input placeholder="Enter Container ID" value={containerId} onChange={(e) => setContainerId(e.target.value)} />
                <Button onClick={fetchContainerById}>Fetch</Button>
              </div>
              {selectedContainer && (
                <div className="mt-4 p-4 border rounded bg-gray-50">
                  <h3 className="font-semibold text-lg">Container Details:</h3>
                  <p><strong>ID:</strong> {selectedContainer.containerId}</p>
                  <p><strong>Zone:</strong> {selectedContainer.zone}</p>
                  <p><strong>Size:</strong> {selectedContainer.width} x {selectedContainer.depth} x {selectedContainer.height} cm</p>
                  <p><strong>Items:</strong> {selectedContainer.items.length} item(s)</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* View All Containers */}
          <Card className="mb-6">
            <CardContent>
              <CardTitle>All Containers</CardTitle>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {containers.length > 0 ? containers.map((container) => (
                    <TableRow key={container.containerId}>
                      <TableCell>{container.containerId}</TableCell>
                      <TableCell>{container.zone}</TableCell>
                      <TableCell>{container.width} x {container.depth} x {container.height} cm</TableCell>
                      <TableCell>
                        <Button className="bg-red-500 text-white" onClick={() => handleDeleteContainer(container.containerId)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">No containers found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Move Item Between Containers */}
          <Card className="mb-6">
            <CardContent>
              <CardTitle>Move Item</CardTitle>
              <div className="grid grid-cols-3 gap-4">
                <Input placeholder="Item ID" value={moveItemData.itemId} onChange={(e) => setMoveItemData({ ...moveItemData, itemId: e.target.value })} />
                <Input placeholder="From Container ID" value={moveItemData.fromContainerId} onChange={(e) => setMoveItemData({ ...moveItemData, fromContainerId: e.target.value })} />
                <Input placeholder="To Container ID" value={moveItemData.toContainerId} onChange={(e) => setMoveItemData({ ...moveItemData, toContainerId: e.target.value })} />
              </div>
              <Button className="mt-4 w-full" onClick={handleMoveItem}>Move Item</Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ViewContainers;
