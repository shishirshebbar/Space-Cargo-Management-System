import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create Authentication Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Fetch User Profile when token changes
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]); // ✅ Runs only when the token changes

  // Fetch User Profile
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      logout(); // ✅ Logout if token is invalid
    }
  };

  // ✅ Login Function (Now only stores token)
  const login = (token) => {
    setToken(token);
    localStorage.setItem("token", token);
  };

  // ✅ Signup Function
  const signup = async (username, password) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, { username, password });
      return { success: true };
    } catch (error) {
      console.error("Signup failed:", error);
      return { success: false, message: error.response?.data?.message || "Signup failed" };
    }
  };

  // ✅ Logout Function
  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
