import { useEffect, useState } from "react";
import { getLogs } from "@/api/logApi";  // Make sure the path is correct
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "@/comp/Navbar";
import SpaceScene from "@/comp/SpaceScene";
import { Link } from "react-router-dom";

const LogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch logs when the "Get Logs" button is clicked
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

  return (
    <div className="p-8 min-h-screen">
      <SpaceScene/>
      <Link
  to="/"
  className="relative z-20 flex items-center justify-end w-full"
>
  <ArrowLeft size={24} sx={{ mr: 1 }} /> 
  Home
</Link>
      <Card className="max-w-4xl mx-auto shadow-lg mt-15">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">System Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={fetchLogs}
            className="w-1/3  mb-6 ml-70 hover:bg-blue-700 text-white"
            disabled={loading}
          >
            {loading ? "Loading Logs..." : "Get Logs"}
          </Button>

          {/* Log Table */}
          {loading ? (
            <div className="flex justify-center items-center">
              <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
          ) : logs.length === 0 ? (
            <p className="text-gray-400 text-center mt-4">No logs found.</p>
          ) : (
            <div className="overflow-x-auto">
            <Table className="border border-gray-700 w-full">
              <TableHead className=" text-gray-300 grid grid-cols-[20%_10%_20%_10%_25%_15%]"> {/* Define column widths */}
                <TableRow className="contents"> {/* Use contents to make TableRow disappear from grid flow */}
                  <TableCell className="text-gray-900 font-semibold px-4 py-3">Timestamp</TableCell>
                  <TableCell className="text-gray-900 font-semibold px-4 py-3">User ID</TableCell>
                  <TableCell className="text-gray-900 font-semibold px-4 py-3">Action Type</TableCell>
                  <TableCell className="text-gray-900 font-semibold px-4 py-3">Item ID</TableCell>
                  <TableCell className="text-gray-900 font-semibold px-4 py-3">From → To</TableCell>
                  <TableCell className="text-gray-900 font-semibold px-4 py-3">Reason</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="grid grid-cols-[20%_10%_20%_10%_25%_15%]"> {/* Match header columns */}
                {logs.map((log, index) => (
                  <TableRow key={index} className="contents"> {/* Use contents */}
                    <TableCell className="px-4 py-3">{new Date(log.timestamp).toLocaleString()}</TableCell>
                    <TableCell className="px-4 py-3">{log.userId || "-"}</TableCell>
                    <TableCell className="px-4 py-3">{log.actionType}</TableCell>
                    <TableCell className="px-4 py-3">{log.itemId || "-"}</TableCell>
                    <TableCell className="px-4 py-3">
                      {log.details?.fromContainer || "-"} → {log.details?.toContainer || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3">{log.details?.reason || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LogPage;
