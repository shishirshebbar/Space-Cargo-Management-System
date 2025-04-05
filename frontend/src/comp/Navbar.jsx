import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";

const Navbar = ({ toggleSidebar }) => {
  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between">
      {/* Sidebar Toggle Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleSidebar} 
        className="lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-gray-800">
        Space Cargo Management
      </Link>

      {/* Navigation Links */}
      <nav className="hidden lg:flex space-x-4">
        <Button variant="link" asChild>
          <Link to="/">Home</Link>
        </Button>
        
        
       
      </nav>
    </header>
  );
};

export default Navbar;