import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GridCard from "@/comp/GridCard";
import AnimatedBeam from "@/comp/animated-beam";
import SpaceScene from "@/comp/SpaceScene";

import {
  Package,
  Box,
  Trash2,
  Activity,
  FileText,
  Import,
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const centerRef = useRef(null);

  const sections = [
    { title: "Import/Export", path: "/import-export", icon: Import },
    { title: "Item Management", path: "/items", icon: Package },
    { title: "Placement", path: "/placement", icon: Box },
    
    { title: "Waste Management", path: "/waste", icon: Trash2 },
    { title: "Simulation", path: "/simulation", icon: Activity },
    { title: "Logs", path: "/logs", icon: FileText },
  ];

  const leftRefs = sections.slice(0, 3).map(() => useRef(null));
  const rightRefs = sections.slice(3).map(() => useRef(null));

  return (
    <div className="relative  text-white overflow-hidden">
      {/* 🌌 Space Background */}
      <SpaceScene />

      {/* Foreground Content */}
      <div
  ref={containerRef}
  className="relative z-10 flex flex-col items-center justify-center px-4 py-3"
>

<h1 className="text-4xl mt-2 font-bold mb-4 text-center text-white glowing-text">
  Space Cargo Management System
</h1>

<p className="max-w-4xl text-gray-300 text-lg mb-5 text-center drop-shadow-md">
  Spaceship Cargo Management is a cutting-edge 3D visualization system
  designed to streamline cargo stowage for interplanetary missions. By
  integrating intelligent space optimization and real-time inventory
  tracking, our platform ensures
  efficient utilization of cargo holds, reducing waste and improving
  mission logistics.
</p>




        <div className="flex items-center justify-center gap-10 w-full max-w-6xl relative z-10">
          {/* Left Column */}
          <div className="flex flex-col gap-4 mb-4">
            {sections.slice(0, 3).map((section, i) => (
              <div key={section.title} ref={leftRefs[i]} className="relative z-10">
              <GridCard
                title={section.title}
                icon={() => (
                  <section.icon className="h-10 w-10 -ml-5 text-blue-500 drop-shadow-lg z-10" />
                )}
                link={section.path}
              />
            </div>
            
            ))}
          </div>

          {/* Center Button */}
          <div className="flex flex-col items-center" ref={centerRef}>
          <Button
  className="px-18 py-10 text-2xl font-semibold rounded-xl shadow-lg transition duration-300 ease-in-out
             bg-blue-600 hover:bg-blue-700 cursor-pointer
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-200
             hover:shadow-[0_0_25px_rgba(59,130,246,0.8)] hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 hover:ring-offset-blue-200"
  onClick={() => navigate("/virtual-tour")}
>
  Start a 3D Virtual Tour
</Button>

</div>


          {/* Right Column */}
          <div className="flex flex-col gap-4">
            {sections.slice(3).map((section, i) => (
              <div key={section.title} ref={rightRefs[i]} className="relative z-10">
                <GridCard
                  title={section.title}
                  icon={() => (
                    <section.icon className="h-10 w-10 -ml-5 text-blue-500 drop-shadow-lg z-10" />
                  )}
                  link={section.path}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Beams */}
        {leftRefs.map((ref, i) => (
          <AnimatedBeam
            key={`beam-left-${i}`}
            containerRef={containerRef}
            fromRef={ref}
            toRef={centerRef}
          />
        ))}
        {rightRefs.map((ref, i) => (
          <AnimatedBeam
            key={`beam-right-${i}`}
            containerRef={containerRef}
            fromRef={ref}
            toRef={centerRef}
            reverse
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
