import { useState } from "react";
import { importItems, importContainers } from "@/api/importExportApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/comp/Navbar";
import { Loader2 } from "lucide-react";

const ImportExportPage = () => {
  const [itemsFile, setItemsFile] = useState(null);
  const [containersFile, setContainersFile] = useState(null);
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingContainers, setLoadingContainers] = useState(false);

  const handleImportItems = async () => {
    if (!itemsFile) {
      toast.error("Please select a CSV file for items");
      return;
    }

    setLoadingItems(true);
    const formData = new FormData();
    formData.append("file", itemsFile);

    try {
      await importItems(formData);
      toast.success("Items imported successfully!");
      setItemsFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to import items");
    }
    setLoadingItems(false);
  };

  const handleImportContainers = async () => {
    if (!containersFile) {
      toast.error("Please select a CSV file for containers");
      return;
    }

    setLoadingContainers(true);
    const formData = new FormData();
    formData.append("file", containersFile);

    try {
      await importContainers(formData);
      toast.success("Containers imported successfully!");
      setContainersFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to import containers");
    }
    setLoadingContainers(false);
  };

  return (
    <div className="p-8  min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto mt-10">
        <h1 className="text-3xl font-bold text-center text-white-900 mb-8">Import Data</h1>

        <div className="space-y-6">
          {/* Import Items Card */}
          <Card className="shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Import Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                type="file" 
                accept=".csv" 
                onChange={(e) => setItemsFile(e.target.files[0])} 
                className="border-gray-300 rounded-lg"
              />
              <Button 
                className="w-full flex items-center justify-center"
                onClick={handleImportItems} 
                disabled={loadingItems}
              >
                {loadingItems ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : "Import Items"}
              </Button>
            </CardContent>
          </Card>

          {/* Import Containers Card */}
          <Card className="shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Import Containers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                type="file" 
                accept=".csv" 
                onChange={(e) => setContainersFile(e.target.files[0])} 
                className="border-gray-300 rounded-lg"
              />
              <Button 
                className="w-full flex items-center justify-center"
                onClick={handleImportContainers} 
                disabled={loadingContainers}
              >
                {loadingContainers ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : "Import Containers"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ImportExportPage;