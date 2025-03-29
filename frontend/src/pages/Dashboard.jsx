import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Comp/Header";
import Footer from "../Comp/Footer";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { token, logout } = useAuth();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };

    if (token) fetchUserProfile();
  }, [token]);

  if (!token) {
    navigate("/login");
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            {user && <p className="text-gray-700">Welcome, {user.username}</p>}
          </div>
          <div className="grid grid-cols-2 gap-6 mt-6">
            <Card
              className="cursor-pointer hover:shadow-lg"
              onClick={() => navigate("/view-waste")}
            >
              <CardContent>
                <CardTitle>View Waste</CardTitle>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer hover:shadow-lg"
              onClick={() => navigate("/view-items")}
            >
              <CardContent>
                <CardTitle>View Items</CardTitle>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer hover:shadow-lg"
              onClick={() => navigate("/view-controllers")}
            >
              <CardContent>
                <CardTitle>View Controller</CardTitle>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer hover:shadow-lg"
              onClick={() => navigate("/view-simulation")}
            >
              <CardContent>
                <CardTitle>View Simulation</CardTitle>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;