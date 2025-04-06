import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { Suspense } from "react";
import CargoBay from "../comp/CargoBay";
import { useNavigate } from "react-router-dom";
import {
  Package, Box, Import, Trash2,
  Activity, FileText
} from "lucide-react";
import Navbar from "@/comp/Navbar";

// List of nav items
const navItems = [
  { title: "Item Management", path: "/items", icon: Package },
  { title: "Placement", path: "/placement", icon: Box },
  { title: "Import/Export", path: "/import-export", icon: Import },
  { title: "Waste Management", path: "/waste", icon: Trash2 },
  { title: "Simulation", path: "/simulation", icon: Activity },
  { title: "Logs", path: "/logs", icon: FileText },
];


const generateSpherePositions = (count, radius = 3) => {
  const positions = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // Fibonacci sphere magic

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2; // from 1 to -1
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;

    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    positions.push([x * radius, y * radius, z * radius]);
  }

  return positions;
};

const VirtualTourPage = () => {
  const navigate = useNavigate();
  const positions = generateSpherePositions(navItems.length, 3); // radius 3 units around center

  return (
    
    <div className="h-screen w-full ">
        <Navbar/>
        
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-black/90 px-4 py-2 rounded-md shadow text-white-800 text-l">
    🌀 Rotate to explore. Click on the buttons to explore the features.
  </div>

      <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={-0.2} />
          <directionalLight position={[10, 15, 10]} intensity={0.5} />
          <directionalLight position={[-10, 15, -10]} intensity={0.5} />
          <OrbitControls />

          
          <CargoBay />

          
          {navItems.map(({ title, path, icon: Icon }, index) => (
            <Html key={title} position={positions[index]} center>
              <button
  onClick={() => navigate(path)}
  className="flex items-center gap-2 px-3 py-2 bg-black text-sm text-white-800 rounded-lg shadow-lg transition hover:shadow-2xl hover:scale-105 duration-300 animate-pulse"
>
  <Icon className="w-4 h-4 text-blue-600" />
  {title}
</button>

            </Html>
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default VirtualTourPage;
