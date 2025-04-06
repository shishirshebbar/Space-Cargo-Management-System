import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import ItemPage from "@/pages/ItemPage";
import PlacementPage from "@/pages/PlacementPage";
import ImportExportPage from "@/pages/ImportExportPage";
import WastePage from "@/pages/WastePage";
import SimulationPage from "@/pages/SimulationPage";
import LogPage from "@/pages/LogPage";
import Navbar from "@/comp/Navbar";
import Sidebar from "@/comp/Sidebar";
import VirtualTourPage from "./pages/VirtualTourPage";

const App = () => {
  return (
    <Router>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Navbar */}
          

          {/* Page Content */}
          <div className="p-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/items" element={<ItemPage />} />
              <Route path="/placement" element={<PlacementPage />} />
              <Route path="/import-export" element={<ImportExportPage />} />
              <Route path="/waste" element={<WastePage />} />
              <Route path="/simulation" element={<SimulationPage />} />
              <Route path="/logs" element={<LogPage />} />
              <Route path="/virtual-tour" element={<VirtualTourPage/>} />

            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;