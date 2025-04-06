import { useState } from "react";
import { importItems, importContainers } from "@/api/importExportApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/comp/Navbar";
import { Loader2, Download, ArrowLeft } from "lucide-react";
import SpaceScene from "@/comp/SpaceScene";
import { Link, useNavigate } from "react-router-dom";

const ImportExportPage = () => {
  const [itemsFile, setItemsFile] = useState(null);
  const [containersFile, setContainersFile] = useState(null);
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingContainers, setLoadingContainers] = useState(false);
  const [downloadingArrangement, setDownloadingArrangement] = useState(false);
  
  // State for success messages
  const [itemsSuccess, setItemsSuccess] = useState(false);
  const [containersSuccess, setContainersSuccess] = useState(false);
  const [arrangementSuccess, setArrangementSuccess] = useState(false);

  const handleImportItems = async () => {
    if (!itemsFile) {
      toast.error("Please select a CSV file for items");
      return;
    }

    setLoadingItems(true);
    try {
      await importItems(itemsFile);
      toast.success("Items imported successfully!");
      setItemsFile(null);
      setItemsSuccess(true); // Set success state
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to import items");
    } finally {
      setLoadingItems(false);
    }
  };

  const handleImportContainers = async () => {
    if (!containersFile) {
      toast.error("Please select a CSV file for containers");
      return;
    }

    setLoadingContainers(true);
    try {
      await importContainers(containersFile);
      toast.success("Containers imported successfully!");
      setContainersFile(null);
      setContainersSuccess(true); // Set success state
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to import containers");
    } finally {
      setLoadingContainers(false);
    }
  };

  const handleDownloadArrangement = async () => {
    setDownloadingArrangement(true);
    try {
      const response = await fetch("http://localhost:8000/api/export/arrangement");
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "arrangement.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setArrangementSuccess(true); // Set success state
    } catch (error) {
      toast.error("Failed to download arrangement");
    } finally {
      setDownloadingArrangement(false);
    }
  };

  return (
    <div className="p-8 min-h-screen">
      <SpaceScene/>
      <Link
        to="/"
        className="relative z-20 flex items-center justify-end w-full"
      >
        <ArrowLeft size={24} sx={{ mr: 1 }} />
        Home
      </Link>

      <div className="max-w-2xl mx-auto mt-3">
        <h1 className="text-3xl font-bold text-center text-white-900 mb-8">Import / Export Data</h1>

        <div className="space-y-6">
          {/* Import Items Card */}
          <Card className="shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Import Items (Upload items csv file)</CardTitle>
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
              {itemsSuccess && <p className="text-green-500 text-center mt-2">Items imported successfully!</p>}
            </CardContent>
          </Card>

          {/* Import Containers Card */}
          <Card className="shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Import Containers (Upload containers csv file)</CardTitle>
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
              {containersSuccess && <p className="text-green-500 text-center mt-2">Containers imported successfully!</p>}
            </CardContent>
          </Card>

          {/* Export Arrangement Card */}
          <Card className="shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Export Arrangement(Download CSV file with the current arrangement)</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full flex items-center justify-center"
                onClick={handleDownloadArrangement}
                disabled={downloadingArrangement}
              >
                {downloadingArrangement ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <Download className="h-5 w-5 mr-2" />}
                Download Arrangement
              </Button>
              {arrangementSuccess && <p className="text-green-500 text-center mt-2">Arrangement downloaded successfully!</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ImportExportPage;
