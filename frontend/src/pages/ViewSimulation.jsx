import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Header from "../Comp/Header";
import Footer from "../Comp/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const ViewSimulation = () => {
  const { token } = useAuth();
  const [simulationState, setSimulationState] = useState([]);
  const [numOfDays, setNumOfDays] = useState("");
  const [simulationMessage, setSimulationMessage] = useState(null);
  const [missionPlanningState, setMissionPlanningState] = useState([]);
  const [missionPlanningMessage, setMissionPlanningMessage] = useState(null);

  const fetchSimulationState = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/simulation/state`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSimulationState(response.data.items || []);
    } catch (error) {
      console.error("Failed to fetch simulation state", error);
    }
  };

  useEffect(() => {
    if (token) fetchSimulationState();
  }, [token]);

  const simulateDays = async () => {
    try {
      if (!numOfDays || numOfDays < 1) {
        setSimulationMessage({ success: false, text: "Number of days must be at least 1" });
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/simulation/simulate-days`,
        { numOfDays },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSimulationMessage({
        success: true,
        text: `Simulated ${numOfDays} days | Items Used: ${response.data.changes.itemsUsed}, Expired: ${response.data.changes.itemsExpired}`,
      });

      setNumOfDays("");
      fetchSimulationState();
    } catch (error) {
      console.error("Simulation failed", error);
      setSimulationMessage({
        success: false,
        text: error.response?.data?.message || "An error occurred while simulating.",
      });
    }
  };

  const fetchMissionPlanningState = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/simulation/state`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMissionPlanningState(response.data.items || []);
      setMissionPlanningMessage({ success: true, text: "Mission planning state retrieved successfully." });
    } catch (error) {
      console.error("Failed to fetch mission planning state", error);
      setMissionPlanningMessage({ success: false, text: "Failed to retrieve mission planning state." });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Simulation Dashboard</h2>

          {/* Section 1: Current State of Items */}
          <Card className="mb-6">
            <CardContent>
              <CardTitle>Current Item State</CardTitle>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Remaining Uses</TableHead>
                    <TableHead>Expiry Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {simulationState.length > 0 ? (
                    simulationState.map((item) => (
                      <TableRow key={item.itemId}>
                        <TableCell>{item.itemId}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.remainingUses}</TableCell>
                        <TableCell>{item.expiryDate ? new Date(item.expiryDate).toISOString() : "N/A"}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">No items found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Section 2: Simulate Days */}
          <Card className="mb-6">
            <CardContent>
              <CardTitle>Simulate Days</CardTitle>
              <div className="flex items-center gap-4 mt-4">
                <Input
                  type="number"
                  placeholder="Enter Number of Days"
                  value={numOfDays}
                  onChange={(e) => setNumOfDays(e.target.value)}
                />
                <Button onClick={simulateDays}>Simulate</Button>
              </div>

              {simulationMessage && (
                <div className={`mt-4 p-2 rounded-lg text-white ${simulationMessage.success ? "bg-green-600" : "bg-red-600"}`}>
                  {simulationMessage.text}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 3: Get Current State of All Items (for Mission Planning) */}
          <Card className="mb-6">
            <CardContent>
              <CardTitle>Mission Planning: Current State of All Items</CardTitle>
              <Button onClick={fetchMissionPlanningState} className="mt-4">Get Mission Planning State</Button>

              {missionPlanningMessage && (
                <div className={`mt-4 p-2 rounded-lg text-white ${missionPlanningMessage.success ? "bg-green-600" : "bg-red-600"}`}>
                  {missionPlanningMessage.text}
                </div>
              )}

              <Table className="mt-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Remaining Uses</TableHead>
                    <TableHead>Expiry Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {missionPlanningState.length > 0 ? (
                    missionPlanningState.map((item) => (
                      <TableRow key={item.itemId}>
                        <TableCell>{item.itemId}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.remainingUses}</TableCell>
                        <TableCell>{item.expiryDate ? new Date(item.expiryDate).toISOString() : "N/A"}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">No items available for mission planning</TableCell>
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

export default ViewSimulation;
