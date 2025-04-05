import { useEffect, useState } from "react";
import { getLogs, logEvent, clearLogs } from "@/api/logApi";
import { Button } from "@/components/ui/button";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Navbar from "@/comp/Navbar";

const LogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState("");
  const [actionType, setActionType] = useState("");
  const [itemId, setItemId] = useState("");
  const [fromContainer, setFromContainer] = useState("");
  const [toContainer, setToContainer] = useState("");
  const [reason, setReason] = useState("");

  // Fetch logs on page load
  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await getLogs();
      setLogs(response.logs || []);
    } catch (error) {
      toast.error("Failed to fetch logs");
    }
    setLoading(false);
  };

  const handleLogEvent = async () => {
    if (!userId || !actionType) {
      toast.error("User ID and Action Type are required");
      return;
    }

    const logData = {
      userId,
      actionType,
      itemId,
      details: {
        fromContainer,
        toContainer,
        reason,
      },
    };

    try {
      await logEvent(logData);
      toast.success("Log added successfully");
      // Reset fields
      setUserId("");
      setActionType("");
      setItemId("");
      setFromContainer("");
      setToContainer("");
      setReason("");
      fetchLogs(); // Refresh logs
    } catch (error) {
      toast.error("Failed to log event");
    }
  };

  const handleClearLogs = async () => {
    try {
      await clearLogs();
      toast.success("Logs cleared successfully");
      setLogs([]);
    } catch (error) {
      toast.error("Failed to clear logs");
    }
  };

  return (
    <div className="p-6">
      <Navbar/>
      <h1 className="mt-10 text-3xl font-bold mb-6 text-gray-200">System Logs</h1>

      {/* Log Entry Form */}
      <Card className="p-6 mb-6 bg-gray-900 border border-white-700 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-300">Add Log Event</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Input placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
          <Input placeholder="Action Type (e.g., placement)" value={actionType} onChange={(e) => setActionType(e.target.value)} />
          <Input placeholder="Item ID" value={itemId} onChange={(e) => setItemId(e.target.value)} />
          <Input placeholder="From Container" value={fromContainer} onChange={(e) => setFromContainer(e.target.value)} />
          <Input placeholder="To Container" value={toContainer} onChange={(e) => setToContainer(e.target.value)} />
          <Input placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={handleLogEvent} className="bg-blue-600 hover:bg-blue-700 text-white">
            Add Log
          </Button>
          <Button onClick={handleClearLogs} className="bg-red-600 hover:bg-red-700 text-white">
            Clear Logs
          </Button>
        </div>
      </Card>

      {/* Log Table */}
      {loading ? (
        <div className="flex justify-center items-center mt-6">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      ) : logs.length === 0 ? (
        <p className="text-gray-400 text-center mt-4">No logs found.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table className="border border-gray-700">
            <TableHead className="bg-gray-800 text-gray-300">
              <TableRow>
                <TableCell className="font-semibold">Timestamp</TableCell>
                <TableCell className="font-semibold">User ID</TableCell>
                <TableCell className="font-semibold">Action Type</TableCell>
                <TableCell className="font-semibold">Item ID</TableCell>
                <TableCell className="font-semibold">From → To</TableCell>
                <TableCell className="font-semibold">Reason</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log, index) => (
                <TableRow
                  key={index}
                  className="bg-gray-900 hover:bg-gray-800 transition-colors"
                >
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{log.userId}</TableCell>
                  <TableCell>{log.actionType}</TableCell>
                  <TableCell>{log.itemId || "-"}</TableCell>
                  <TableCell>{log.details?.fromContainer || "-"} → {log.details?.toContainer || "-"}</TableCell>
                  <TableCell>{log.details?.reason || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default LogPage;
