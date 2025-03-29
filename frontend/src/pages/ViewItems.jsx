import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Comp/Header";
import Footer from "../Comp/Footer";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const ViewItems = () => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [searchedItem, setSearchedItem] = useState(null);
  const [wasteItems, setWasteItems] = useState([]);
  const [newItem, setNewItem] = useState({
    itemId: "",
    name: "",
    width: "",
    depth: "",
    height: "",
    mass: "",
    priority: "",
    expiryDate: "",
    usageLimit: "",
    preferredZone: ""
  });

  const navigate = useNavigate();

  // Fetch all items from DB
  const fetchItems = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(response.data.items || []);
    } catch (error) {
      console.error("Failed to fetch items", error);
    }
  };

  useEffect(() => {
    if (token) fetchItems();
  }, [token]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/items/search?itemId=${searchId}`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setSearchedItem(response.data.item);
    } catch (error) {
      console.error("Item not found", error);
      setSearchedItem(null);
    }
  };
  

  const handleAddItem = async () => {
    try {
      const formattedExpiryDate = newItem.expiryDate
        ? new Date(newItem.expiryDate).toISOString()
        : null;

      const payload = { ...newItem, expiryDate: formattedExpiryDate };

      console.log("Sending data:", payload); // Debugging

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/items/add`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Item added successfully!");
      setNewItem({
        itemId: "",
        name: "",
        width: "",
        depth: "",
        height: "",
        mass: "",
        priority: "",
        expiryDate: "",
        usageLimit: "",
        preferredZone: "",
      });

      fetchItems(); // Refresh the list after adding an item
    } catch (error) {
      console.error("Failed to add item", error.response?.data || error.message);
    }
  };
  const handleRetrieveItem = async (itemId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/items/retrieve`,
        { itemId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      alert("Item retrieved successfully!");
      fetchItems(); // Refresh item list after retrieval
    } catch (error) {
      console.error("Failed to retrieve item", error);
      alert(error.response?.data?.message || "Error retrieving item");
    }
  };
 

 

  const fetchWasteItems = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/items/waste`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setWasteItems(response.data.wasteItems);
    } catch (error) {
      console.error("Failed to fetch waste items", error);
    }
  };
  
  useEffect(() => {
    if (token) fetchWasteItems();
  }, [token]);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Manage Items</h2>

          {/* Add New Item */}
          <Card className="mb-6">
            <CardContent>
              <CardTitle>Add New Item</CardTitle>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {Object.keys(newItem).map((key) => (
                  <Input
                    key={key}
                    type={key === "expiryDate" ? "date" : "text"}
                    placeholder={key}
                    value={newItem[key]}
                    onChange={(e) => setNewItem({ ...newItem, [key]: e.target.value })}
                  />
                ))}
              </div>
              <Button className="mt-4" onClick={handleAddItem}>Add Item</Button>
            </CardContent>
          </Card>

          {/* Display All Items */}
          <h3 className="text-xl font-semibold text-gray-800 mb-3">All Items</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Preffered Zone</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Container</TableHead>
               
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length > 0 ? (
                items.map((item) => (
                  <TableRow key={item._id} className="text-gray-900">
                    <TableCell>{item.itemId}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.priority}</TableCell>
                    <TableCell>{item.preferredZone}</TableCell>
                    <TableCell>{item.expiryDate ? new Date(item.expiryDate).toISOString() : "N/A"}</TableCell>
                    <TableCell>{item.containerId ? item.containerId._id : "Unassigned"}</TableCell>
                    
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">No items found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Search Item by ID */}
          <Card className="mt-6">
            <CardContent>
              <CardTitle>Search Item by ID</CardTitle>
              <div className="flex items-center gap-4 mt-4">
                <Input
                  type="text"
                  placeholder="Enter Item ID"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                />
                <Button onClick={handleSearch}>Search</Button>
              </div>

              {/* Display searched item details */}
              {searchedItem && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <h4 className="text-lg font-bold">Item Details</h4>
                  <p><strong>ID:</strong> {searchedItem.itemId}</p>
                  <p><strong>Name:</strong> {searchedItem.name}</p>
                  <p><strong>Priority:</strong> {searchedItem.priority}</p>
                  <p><strong>Expiry Date:</strong> {searchedItem.expiryDate ? new Date(searchedItem.expiryDate).toISOString() : "N/A"}</p>
                  <p><strong>Container:</strong> {searchedItem.containerId ? searchedItem.containerId._id : "Unassigned"}</p>
                </div>
              )}

              {/* Not Found Message */}
              {searchedItem === null && searchId && (
                <p className="mt-4 text-red-600">Item not found</p>
              )}
            </CardContent>
          </Card>
          <Card className="mt-6">
          <CardContent>
            <CardTitle>Retrieve Item</CardTitle>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Usage Limit</TableHead>
                  <TableHead>Remaining Usages</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length > 0 ? (
                  items.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.itemId}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.usageLimit}</TableCell>
                      <TableCell>{item.usageLimit > 0 ? item.usageLimit : "Expired"}</TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          onClick={() => handleRetrieveItem(item.itemId)}
                          disabled={item.usageLimit <= 0} // Disable button if no remaining usages
                        >
                          Retrieve
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No items available</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="mt-6">
  <CardContent>
    <CardTitle className="mb-3">Expired or Fully Used Items</CardTitle>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Expiry Date</TableHead>
          <TableHead>Remaining Usage</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {wasteItems.length > 0 ? (
          wasteItems.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.itemId}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "N/A"}
              </TableCell>
              <TableCell>{item.usageLimit}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center">No expired or fully used items</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </CardContent>
</Card>

    
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ViewItems;
