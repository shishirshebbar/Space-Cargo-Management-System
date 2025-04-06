import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, Menu } from "lucide-react";

const Navbar = ({ toggleSidebar }) => {
  return (
    <header className="bg-white shadow-md p-5 flex items-center justify-between">
      
      

      <Link
              to="/"
              className="relative z-20 flex items-center justify-end w-full font-bold text-gray-900"
            >
              <ArrowLeft size={24} sx={{ mr: 1 }} /> 
              Home
            </Link>
        
       
     
    </header>
  );
};

export default Navbar;