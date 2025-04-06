import { useNavigate } from "react-router-dom";
import GridCard from "@/comp/GridCard";
import { Package, Box, Trash2, Activity, FileText, Import, Globe2 } from "lucide-react"; // Added icons for new items

const Dashboard = () => {
  const navigate = useNavigate();

    const sections = [
    { title: "Item Management", path: "/items", icon: Package },
    { title: "Placement", path: "/placement", icon: Box },
    { title: "Import/Export", path: "/import-export", icon: Import },
    { title: "Waste Management", path: "/waste", icon: Trash2 },
    { title: "Simulation", path: "/simulation", icon: Activity },
    { title: "Logs", path: "/logs", icon: FileText },
    { title: "3D Virtual Tour", path: "/virtual-tour", icon: Globe2 },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {sections.map((section) => (
          <GridCard
            key={section.title}
            title={section.title}
            icon={() => <section.icon className="h-12 w-12 text-gray-700 ml-[-20px]" />}
            link={section.path}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
