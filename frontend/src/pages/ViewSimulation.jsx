import { useState, useEffect } from "react";
import Header from "../Comp/Header";
import Footer from "../Comp/Footer";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const ViewSimulation = () => {
  const { token } = useAuth();
  const [simulationData, setSimulationData] = useState([]);
  const [simulatedTime, setSimulatedTime] = useState("");

  useEffect(() => {
    fetchSimulationState();
  }, [token]);

  const fetchSimulationState = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/simulation`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSimulationData(response.data);
    } catch (error) {
      console.error("Failed to fetch simulation state", error);
    }
  };

  const handleSimulateTime = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/simulation/advance-time`,
        { time: simulatedTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSimulationData(response.data);
      alert("Time simulation updated!");
    } catch (error) {
      console.error("Failed to simulate time", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">View Simulation</h2>

          {/* Simulate Time */}
          <Card className="mb-6">
            <CardContent>
              <CardTitle>Simulate Time Passage</CardTitle>
              <input
                type="number"
                placeholder="Enter time in hours"
                value={simulatedTime}
                onChange={(e) => setSimulatedTime(e.target.value)}
                className="p-2 border rounded w-full mb-2"
              />
              <Button onClick={handleSimulateTime}>Simulate</Button>
            </CardContent>
          </Card>

          {/* Current Simulation State */}
          <Table className="mb-6">
            <TableHeader>
              <TableRow>
                <TableHead>Item ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Remaining Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {simulationData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.remainingTime} hrs</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ViewSimulation;