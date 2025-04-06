import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu, Home, Grid, Package, Trash2, Clock, FileText } from "lucide-react";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
     
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      
      <SheetContent side="left" className="w-64 bg-gray-100">
        <div className="flex flex-col space-y-4 mt-4">
         
          <LinkItem to="/" icon={Home} label="Home" onClick={() => setOpen(false)} />
          <LinkItem to="/dashboard" icon={Grid} label="Dashboard" onClick={() => setOpen(false)} />
          <LinkItem to="/import-export" icon={Package} label="Import/Export" onClick={() => setOpen(false)} />
          <LinkItem to="/placement" icon={Grid} label="Placement" onClick={() => setOpen(false)} />
          <LinkItem to="/waste" icon={Trash2} label="Waste" onClick={() => setOpen(false)} />
          <LinkItem to="/simulation" icon={Clock} label="Simulation" onClick={() => setOpen(false)} />
          <LinkItem to="/log" icon={FileText} label="Logs" onClick={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

const LinkItem = ({ to, icon: Icon, label, onClick }) => (
  <Link to={to} className="flex items-center space-x-3 px-4 py-2 rounded-md hover:bg-gray-200" onClick={onClick}>
    <Icon className="h-5 w-5 text-gray-700" />
    <span className="text-gray-800">{label}</span>
  </Link>
);

export default Sidebar;