import { useState } from "react";
import { getLogs } from "@/api/logApi"; // Import the getLogs function from your API utility
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner"; // Assuming you're using this for toast notifications
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const LogsPage = () => {
  const [itemId, setItemId] = useState(""); // State to store itemId input
  const [logs, setLogs] = useState([]); // State to store logs fetched from the API
  const [loading, setLoading] = useState(false); // State for loading state

  // Handle input change for itemId
  const handleItemIdChange = (e) => {
    setItemId(e.target.value);
  };

  // Function to fetch logs based on itemId
  const fetchLogs = async () => {
    if (!itemId) {
      toast.error("Item ID is required to fetch logs.");
      return;
    }

    setLoading(true);
    try {
      const logsData = await getLogs(itemId); // Fetch logs using the getLogs API function
      setLogs(logsData.logs || []); // Update the state with the fetched logs
      toast.success("Logs fetched successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to fetch logs.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-8">
      <Link to="/" className="relative z-20 flex items-center justify-end w-full">
        <ArrowLeft size={24} sx={{ mr: 1 }} />
        Home
      </Link>
      <div className="max-w-4xl mx-auto space-y-10 mt-5">
        <h1 className="text-3xl font-bold text-center">Fetch Item Logs</h1>

        {/* Item ID Input */}
        <Card>
          <CardHeader>
            <CardTitle>Enter Item ID</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <Input
              name="itemId"
              type="text"
              placeholder="Enter Item ID"
              value={itemId}
              onChange={handleItemIdChange}
            />
          </CardContent>
        </Card>

        {/* Button to fetch logs */}
        <div className="text-center">
          <Button
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition duration-300"
            onClick={fetchLogs}
            disabled={loading}
          >
            {loading ? "Fetching Logs..." : "Fetch Logs"}
          </Button>
        </div>

        {/* Display Logs in Table */}
        {logs && logs.length > 0 && (
          <div className="overflow-x-auto mt-6">
            <table className="border border-gray-700 w-full">
              <thead className="text-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left">Timestamp</th>
                  <th className="px-4 py-3 text-left">User ID</th>
                  <th className="px-4 py-3 text-left">Action Type</th>
                  <th className="px-4 py-3 text-left">Item ID</th>
                  <th className="px-4 py-3 text-left">From → To</th>
                  <th className="px-4 py-3 text-left">Reason</th>
                </tr>
              </thead>
              <tbody className="text-gray-400">
                {logs.map((log, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-3">{log.userId || "-"}</td>
                    <td className="px-4 py-3">{log.actionType}</td>
                    <td className="px-4 py-3">{log.itemId || "-"}</td>
                    <td className="px-4 py-3">
                      {log.details?.fromContainer || "-"} → {log.details?.toContainer || "-"}
                    </td>
                    <td className="px-4 py-3">{log.details?.reason || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* If no logs are found */}
        {logs && logs.length === 0 && !loading && (
          <div className="text-center text-red-500 mt-4">
            No logs found for the provided Item ID.
          </div>
        )}
      </div>
    </div>
  );
};

export default LogsPage;
