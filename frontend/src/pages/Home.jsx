import Header from "../Comp/Header";
import Footer from "../Comp/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold text-gray-900">Space Cargo Management System</h1>
        <p className="mt-4 text-lg text-gray-700 max-w-2xl">
          Efficiently manage space cargo storage, retrieval, and waste management with AI-powered recommendations.
        </p>
        <div className="mt-6 space-x-4">
          <Button onClick={() => navigate("/signup")} className="px-6">
            Sign Up
          </Button>
          <Button onClick={() => navigate("/login")} className="px-6" variant="outline">
            Login
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;