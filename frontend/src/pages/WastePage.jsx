import { useState } from "react";
import { identifyWaste, generateReturnPlan, completeUndocking } from "@/api/wasteApi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navbar from "@/comp/Navbar";

const WastePage = () => {
  const [loading, setLoading] = useState(false);

  const handleIdentifyWaste = async () => {
    setLoading(true);
    try {
      await identifyWaste();
      toast.success("Waste items identified successfully");
    } catch (error) {
      toast.error("Failed to identify waste items");
    }
    setLoading(false);
  };

  const handleGenerateReturnPlan = async () => {
    setLoading(true);
    try {
      await generateReturnPlan({ type: "standard" });
      toast.success("Return plan generated successfully");
    } catch (error) {
      toast.error("Failed to generate return plan");
    }
    setLoading(false);
  };

  const handleCompleteUndocking = async () => {
    setLoading(true);
    try {
      await completeUndocking({ confirmed: true });
      toast.success("Waste undocking completed successfully");
    } catch (error) {
      toast.error("Failed to complete undocking");
    }
    setLoading(false);
  };

  return (
    <div className="p-8  min-h-screen">
            <Navbar/>
      <div className=" mt-30 ml-100 w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg border border-white-700">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Waste Management</h1>

        <div className="flex flex-col space-y-4">
          <Button 
            onClick={handleIdentifyWaste} 
            disabled={loading} 
            className="w-full"
          >
            {loading ? "Identifying..." : "Identify Waste"}
          </Button>

          <Button 
            onClick={handleGenerateReturnPlan} 
            disabled={loading} 
            className="w-full"
          >
            {loading ? "Generating Plan..." : "Generate Return Plan"}
          </Button>

          <Button 
            onClick={handleCompleteUndocking} 
            disabled={loading} 
            variant="destructive" 
            className="w-full"
          >
            {loading ? "Completing..." : "Complete Undocking"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WastePage;