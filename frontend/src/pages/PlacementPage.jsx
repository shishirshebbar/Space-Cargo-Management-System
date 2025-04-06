import { useState } from "react";
import { placeItems } from "@/api/placementApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/comp/Navbar";

const PlacementPage = () => {
  const [item, setItem] = useState({
    itemId: "",
    name: "",
    width: "",
    depth: "",
    height: "",
    priority: "",
    expiryDate: "",
    usageLimit: "",
    preferredZone: "",
  });

  const [container, setContainer] = useState({
    containerId: "",
    zone: "",
    width: "",
    depth: "",
    height: "",
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleItemChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleContainerChange = (e) => {
    setContainer({ ...container, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const payload = {
      items: [
        {
          ...item,
          width: parseFloat(item.width),
          depth: parseFloat(item.depth),
          height: parseFloat(item.height),
          priority: parseInt(item.priority),
          usageLimit: parseInt(item.usageLimit),
          expiryDate: item.expiryDate || null,
        },
      ],
      containers: [
        {
          ...container,
          width: parseFloat(container.width),
          depth: parseFloat(container.depth),
          height: parseFloat(container.height),
        },
      ],
    };

    setLoading(true);
    try {
      const res = await placeItems(payload);
      setResponse(res);
      toast.success("Item placed successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Placement failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Navbar />
      <div className="max-w-4xl mx-auto space-y-10 mt-10">
        <h1 className="text-3xl font-bold text-center">Item Placement</h1>

        {/* Item Input */}
        <Card>
          <CardHeader><CardTitle>Item Details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {["itemId", "name", "width", "depth", "height", "priority", "expiryDate", "usageLimit", "preferredZone"].map((field) => (
              <Input
                key={field}
                name={field}
                type={field === "expiryDate" ? "date" : "text"}
                placeholder={field}
                value={item[field]}
                onChange={handleItemChange}
              />
            ))}
          </CardContent>
        </Card>

        {/* Container Input */}
        <Card>
          <CardHeader><CardTitle>Container Details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {["containerId", "zone", "width", "depth", "height"].map((field) => (
              <Input
                key={field}
                name={field}
                type="text"
                placeholder={field}
                value={container[field]}
                onChange={handleContainerChange}
              />
            ))}
          </CardContent>
        </Card>

        <div className="text-center">
        <Button
  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition duration-300"
  onClick={handleSubmit}
  disabled={loading}
>
  {loading ? "Placing..." : "Place Item"}
</Button>

        </div>

        {/* Display response */}
        {response && (
          <Card className="bg-gray-800 text-white mt-6">
            <CardHeader><CardTitle>Placement Response</CardTitle></CardHeader>
            <CardContent>
              <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(response, null, 2)}</pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PlacementPage;
