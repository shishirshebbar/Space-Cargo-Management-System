import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ViewItems from "./pages/ViewItems";
import ViewControllers from "./pages/ViewControllers";
import ViewSimulation from "./pages/ViewSimulation";
import ViewWaste from "./pages/ViewWaste";

const AppRoutes = () => {
  const { user } = useAuth(); // Get authentication status

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/view-items" element={user ? <ViewItems /> : <Navigate to="/login" />} />
      <Route path="/view-controllers" element={user ? <ViewControllers /> : <Navigate to="/login" />} />
      <Route path="/view-simulation" element={user ? <ViewSimulation /> : <Navigate to="/login" />} />
      <Route path="/view-waste" element={user ? <ViewWaste /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
