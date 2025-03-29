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
  const navigate = useNavigate();

  // Fetch items from API
  const fetchItems = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/items`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API Response:", response.data); // Debugging log
      setItems(Array.isArray(response.data) ? response.data : response.data.items || []);
    } catch (error) {
      console.error("Failed to fetch items", error);
    }
  };

  useEffect(() => {
    if (token) fetchItems();
  }, [token]);

  // Search for an item by ID
  const handleSearch = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/items/${searchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSearchedItem(response.data);
    } catch (error) {
      console.error("Item not found", error);
      setSearchedItem(null);
    }
  };

  // Retrieve an item
  const handleRetrieveItem = async (itemId) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/items/retrieve/${itemId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Item retrieved successfully!");
      fetchItems(); // Refresh item list
    } catch (error) {
      console.error("Failed to retrieve item", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">View Items</h2>

          {/* Search Item */}
          <div className="mb-6 flex gap-4">
            <Input
              type="text"
              placeholder="Search Item by ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>

          {/* Display searched item */}
          {searchedItem && (
            <Card className="mb-6">
              <CardContent>
                <CardTitle>Item Details</CardTitle>
                <p><strong>ID:</strong> {searchedItem._id}</p>
                <p><strong>Name:</strong> {searchedItem.name}</p>
                <p><strong>Category:</strong> {searchedItem.category}</p>
                <p><strong>Expiry Date:</strong> {new Date(searchedItem.expiryDate).toLocaleDateString()}</p>
                <Button className="mt-2" onClick={() => handleRetrieveItem(searchedItem._id)}>
                  Retrieve Item
                </Button>
              </CardContent>
            </Card>
          )}

          {/* View All Items Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length > 0 ? (
                items.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item._id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{new Date(item.expiryDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => handleRetrieveItem(item._id)}>
                        Retrieve
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No items found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ViewItems;
