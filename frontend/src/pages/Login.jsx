import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Comp/Header";
import Footer from "../Comp/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth(); // ✅ Only using login function properly
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, formData);
      if (response.status === 200) {
        login(response.data.token); // ✅ Correct usage (only storing token)
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Login</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="text-gray-900"
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="text-gray-900"
            />
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <span className="text-blue-500 cursor-pointer" onClick={() => navigate("/signup")}>
              Sign up here
            </span>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
